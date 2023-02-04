import { CL_MAX_TICK, CL_MIN_TICK, CLTick, getBigNumber, RToken, UniV3Pool } from '@sushiswap/tines'
import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import WETH9 from 'canonical-weth/build/contracts/WETH9.json'
import { expect } from 'chai'
import { BigNumber, BigNumberish, Contract, ContractFactory, Signer } from 'ethers'
import { ethers } from 'hardhat'
import seedrandom from 'seedrandom'

const ZERO = getBigNumber(0)

// Map of fee to tickSpacing
const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, logInfoIfFalse = '') {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).true
  }
  return res
}

interface Environment {
  user: Signer
  tokenFactory: ContractFactory
  UniV3Factory: Contract
  positionManager: Contract
  testRouter: Contract
}

async function createEnv(): Promise<Environment> {
  const [user] = await ethers.getSigners()

  const tokenFactory = await ethers.getContractFactory('ERC20Mock', user)

  const UniV3FactoryFactory = await ethers.getContractFactory('UniswapV3Factory')
  const UniV3Factory = await UniV3FactoryFactory.deploy()
  await UniV3Factory.deployed()

  const WETH9Factory = await ethers.getContractFactory(WETH9.abi, WETH9.bytecode)
  const WETH9Contract = await WETH9Factory.deploy()
  await WETH9Contract.deployed()

  const NonfungiblePositionManagerFactory = await ethers.getContractFactory(
    NonfungiblePositionManager.abi,
    NonfungiblePositionManager.bytecode
  )
  const NonfungiblePositionManagerContract = await NonfungiblePositionManagerFactory.deploy(
    UniV3Factory.address,
    WETH9Contract.address,
    '0x0000000000000000000000000000000000000000'
  )
  const positionManager = await NonfungiblePositionManagerContract.deployed()

  const TestRouterFactory = await ethers.getContractFactory('TestRouter')
  const testRouter = await TestRouterFactory.deploy()
  await testRouter.deployed()

  return {
    user,
    tokenFactory,
    UniV3Factory,
    positionManager,
    testRouter,
  }
}

interface Position {
  from: number
  to: number
  val: number
}

interface PoolInfo {
  contract: Contract
  tinesPool: UniV3Pool
  token0Contract: Contract
  token1Contract: Contract
}

export async function getPoolState(pool: Contract) {
  const slot = await pool.slot0()
  const PoolState = {
    liquidity: await pool.liquidity(),
    tickSpacing: await pool.tickSpacing(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }
  return PoolState
}

function isLess(a: Contract, b: Contract): boolean {
  const addrA = a.address.toLowerCase().substring(2).padStart(40, '0')
  const addrB = b.address.toLowerCase().substring(2).padStart(40, '0')
  return addrA < addrB
}

const tokenSupply = getBigNumber(Math.pow(2, 255))
async function createPool(env: Environment, fee: number, price: number, positions: Position[]): Promise<PoolInfo> {
  const sqrtPriceX96 = getBigNumber(Math.sqrt(price) * Math.pow(2, 96))
  const tickSpacing = feeAmountTickSpacing[fee]
  expect(tickSpacing).not.undefined

  const _token0Contract = await env.tokenFactory.deploy('Token0', 'Token0', tokenSupply)
  const _token1Contract = await env.tokenFactory.deploy('Token1', 'Token1', tokenSupply)
  const [token0Contract, token1Contract] = isLess(_token0Contract, _token1Contract)
    ? [_token0Contract, _token1Contract]
    : [_token1Contract, _token0Contract]

  const token0: RToken = { name: 'Token0', symbol: 'Token0', address: token0Contract.address }
  const token1: RToken = { name: 'Token1', symbol: 'Token1', address: token1Contract.address }

  await token0Contract.approve(env.testRouter.address, tokenSupply)
  await token1Contract.approve(env.testRouter.address, tokenSupply)

  await env.positionManager.createAndInitializePoolIfNecessary(
    token0Contract.address,
    token1Contract.address,
    getBigNumber(fee),
    sqrtPriceX96
  )

  const poolAddress = await env.UniV3Factory.getPool(token0Contract.address, token1Contract.address, fee)
  const poolF = await ethers.getContractFactory('UniswapV3Pool')
  const pool = poolF.attach(poolAddress)

  const tickMap = new Map<number, BigNumber>()
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    expect(position.from % tickSpacing).to.equal(0)
    expect(position.to % tickSpacing).to.equal(0)

    const liquidity = getBigNumber(position.val)
    await env.testRouter.mint(poolAddress, position.from, position.to, liquidity)

    let tickLiquidity = tickMap.get(position.from)
    tickLiquidity = tickLiquidity === undefined ? liquidity : tickLiquidity.add(liquidity)
    tickMap.set(position.from, tickLiquidity)

    tickLiquidity = tickMap.get(position.to) || ZERO
    tickLiquidity = tickLiquidity.sub(liquidity)
    tickMap.set(position.to, tickLiquidity)
  }

  const slot = await pool.slot0()
  const ticks: CLTick[] = Array.from(tickMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([index, DLiquidity]) => ({ index, DLiquidity }))

  const tinesPool = new UniV3Pool(
    pool.address,
    token0,
    token1,
    fee / 1e6,
    await token0Contract.balanceOf(pool.address),
    await token1Contract.balanceOf(pool.address),
    slot[1],
    await pool.liquidity(),
    sqrtPriceX96,
    ticks
  )

  return {
    contract: pool,
    tinesPool,
    token0Contract,
    token1Contract,
  }
}

async function checkSwap(
  env: Environment,
  pool: PoolInfo,
  amount: number | BigNumberish,
  direction: boolean,
  updateTinesPool = false,
  printTick = false
) {
  if (updateTinesPool) {
    // update tines pool data
    const slot = await pool.contract.slot0()
    pool.tinesPool.updateState(
      await pool.token0Contract.balanceOf(pool.contract.address),
      await pool.token1Contract.balanceOf(pool.contract.address),
      slot[1], // tick
      await pool.contract.liquidity(),
      slot[0] // price
    )
  }

  const amountBN: BigNumber = typeof amount == 'number' ? getBigNumber(amount) : BigNumber.from(amount)
  const amountN: number = typeof amount == 'number' ? amount : parseInt(amount.toString())
  const [inToken, outToken] = direction
    ? [pool.token0Contract, pool.token1Contract]
    : [pool.token1Contract, pool.token0Contract]
  const inBalanceBefore = await inToken.balanceOf(env.user.getAddress())
  const outBalanceBefore = await outToken.balanceOf(env.user.getAddress())
  const tickBefore = (await pool.contract.slot0())[1]
  await env.testRouter.swap(pool.contract.address, direction, amountBN)
  const tickAfter = (await pool.contract.slot0())[1]
  const inBalanceAfter = await inToken.balanceOf(env.user.getAddress())
  const outBalanceAfter = await outToken.balanceOf(env.user.getAddress())
  if (printTick) console.log(tickBefore, '->', tickAfter)

  const amountOut = outBalanceAfter.sub(outBalanceBefore)
  const amountIn: BigNumber = inBalanceBefore.sub(inBalanceAfter)
  if (amountIn.eq(amountBN)) {
    // all input value were swapped to output
    const amounOutTines = pool.tinesPool.calcOutByIn(amountN, direction)
    expectCloseValues(amountOut, amounOutTines.out, 1e-12)
  } else {
    // out of liquidity
    expect(amountIn.lt(amountBN)).true
    let errorThrown = false
    let amounOutTines = 0
    try {
      amounOutTines = pool.tinesPool.calcOutByIn(amountN, direction).out
    } catch (e) {
      errorThrown = true
    }
    if (!errorThrown) {
      expectCloseValues(amountOut, amounOutTines, 1e-12)
    }
  }
}

const minPrice = Math.pow(1.0001, CL_MIN_TICK)
const maxPrice = Math.pow(1.0001, CL_MAX_TICK)
async function getRandomSwapParams(rnd: () => number, pool: PoolInfo): Promise<[number, boolean]> {
  const slot = await pool.contract.slot0()
  const sqrtPrice = parseInt(slot[0].toString()) / Math.pow(2, 96)
  const price = sqrtPrice * sqrtPrice // res1/res0

  let direction = true
  if (price < minPrice * 10) direction = false
  else if (price > maxPrice / 10) direction = true
  else direction = rnd() > 0.5

  const res0BN = await pool.token0Contract.balanceOf(pool.contract.address)
  const res0 = parseInt(res0BN.toString())
  const res1BN = await pool.token1Contract.balanceOf(pool.contract.address)
  const res1 = parseInt(res1BN.toString())

  const maxRes = direction ? res1 / price : res0 * price
  const amount = Math.round(rnd() * maxRes) + 1000

  console.log(res0, res1, price, maxRes, amount, direction)

  return [amount, direction]
}

async function monkeyTest(env: Environment, pool: PoolInfo, seed: string, iterations: number, printTick = false) {
  const rnd: () => number = seedrandom(seed) // random [0, 1)
  for (let i = 0; i < iterations; ++i) {
    const [amount, direction] = await getRandomSwapParams(rnd, pool)
    await checkSwap(env, pool, amount, direction, true, printTick)
  }
}

describe('Uni V3', () => {
  let env: Environment

  before(async () => {
    env = await createEnv()
  })

  it('Empty pool', async () => {
    const pool = await createPool(env, 3000, 1, [])
    await checkSwap(env, pool, 100, true)
    await checkSwap(env, pool, 100, false)
  })

  describe('One position', () => {
    it('No tick crossing', async () => {
      const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e16, true)
      const pool2 = await createPool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e16, false)
    })

    it('Tick crossing', async () => {
      const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      const pool2 = await createPool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e20, false)
    })

    it('Swap exact to tick', async () => {
      const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, '616469173272709204', true) // before tick
      const pool2 = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, '616469173272709205', true) // after tick
      const pool3 = await createPool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool3, '460875064077414607', false) // before tick
      const pool4 = await createPool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool4, '460875064077414607', false) // after tick
    })

    it('From 0 zone to not 0 zone', async () => {
      const pool = await createPool(env, 3000, 50, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e17, true)
      const pool2 = await createPool(env, 3000, 0.1, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e17, false)
    })

    it('From 0 zone through ticks to 0 zone', async () => {
      const pool = await createPool(env, 3000, 50, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      const pool2 = await createPool(env, 3000, 0.1, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e19, false)
    })

    it('Special case 1', async () => {
      const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      await checkSwap(env, pool, 1, false, true)
    })

    it.skip('Monkey test', async () => {
      const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await monkeyTest(env, pool, 'test1', 1000, true)
    })
  })

  describe('Two positions', () => {
    it('Special 1', async () => {
      const pool = await createPool(env, 3000, 12.310868067131443, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await checkSwap(env, pool, 85433172055732540, true)
    })
    it('Special 2', async () => {
      const pool = await createPool(env, 3000, 121.48126046130433, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await checkSwap(env, pool, '154350003013680480', true)
    })
    it('Special 3', async () => {
      const pool = await createPool(env, 3000, 6.857889404362659, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await checkSwap(env, pool, '994664157591385500', true)
    })
    it('No overlapping small monkey test', async () => {
      const pool = await createPool(env, 3000, 3, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await monkeyTest(env, pool, 'small', 10)
    })
    it.skip('No overlapping big monkey test', async () => {
      const pool = await createPool(env, 3000, 3, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await monkeyTest(env, pool, 'big', 1000, true)
    })
    it('Touching positions small monkey test', async () => {
      const pool = await createPool(env, 3000, 4, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 18000, to: 42000, val: 5e18 },
      ])
      await monkeyTest(env, pool, '_small', 10)
    })
    it.skip('Touching positions big monkey test', async () => {
      const pool = await createPool(env, 3000, 4, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 18000, to: 42000, val: 5e18 },
      ])
      await monkeyTest(env, pool, '_big', 1000, true)
    })
    it('Overlapped positions small monkey test', async () => {
      const pool = await createPool(env, 3000, 8, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await monkeyTest(env, pool, 'Small', 10)
    })
    it.skip('Overlapped positions small monkey test', async () => {
      const pool = await createPool(env, 3000, 8, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await monkeyTest(env, pool, 'Big', 1000, true)
    })
    it('Nested positions small monkey test', async () => {
      const pool = await createPool(env, 3000, 8, [
        { from: -1200, to: 24000, val: 2e18 },
        { from: 6000, to: 12000, val: 6e18 },
      ])
      await monkeyTest(env, pool, '_small_', 10)
    })
    it.skip('Nested positions big monkey test', async () => {
      const pool = await createPool(env, 3000, 8, [
        { from: -1200, to: 24000, val: 2e18 },
        { from: 6000, to: 12000, val: 6e18 },
      ])
      await monkeyTest(env, pool, '_big_', 1000, true)
    })
  })
})
