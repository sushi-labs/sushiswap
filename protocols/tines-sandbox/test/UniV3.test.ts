import { CLTick, getBigNumber, RPool, RToken, UniV3Pool } from '@sushiswap/tines'
import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import WETH9 from 'canonical-weth/build/contracts/WETH9.json'
import { expect } from 'chai'
import { BigNumber, Contract, ContractFactory, Signer, utils } from 'ethers'
import { ethers } from 'hardhat'

const ZERO = getBigNumber(0)

// Map of fee to tickSpacing
const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, logInfoIfFalse = ''): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  const res = Math.abs(a / b - 1) < accuracy
  if (!res) {
    console.log('Expected close: ', a, b, accuracy, logInfoIfFalse)
    // debugger
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
  tinesPool: RPool
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

  const ticks: CLTick[] = Array.from(tickMap.entries()).map(([index, DLiquidity]) => ({ index, DLiquidity }))
  const tinesPool = new UniV3Pool(
    pool.address,
    token0,
    token1,
    fee / 1e6,
    await token0Contract.balanceOf(pool.address),
    await token1Contract.balanceOf(pool.address),
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

async function checkSwap(env: Environment, pool: PoolInfo, amount: number, direction: boolean) {
  const [inToken, outToken] = direction
    ? [pool.token0Contract, pool.token1Contract]
    : [pool.token1Contract, pool.token0Contract]
  const inBalanceBefore = await inToken.balanceOf(env.user.getAddress())
  const outBalanceBefore = await outToken.balanceOf(env.user.getAddress())
  const tickBefore = (await pool.contract.slot0())[1]
  await env.testRouter.swap(pool.contract.address, direction, getBigNumber(amount))
  const tickAfter = (await pool.contract.slot0())[1]
  const inBalanceAfter = await inToken.balanceOf(env.user.getAddress())
  const outBalanceAfter = await outToken.balanceOf(env.user.getAddress())

  //console.log(tickBefore, '->', tickAfter)

  const amountIn = parseInt(inBalanceBefore.sub(inBalanceAfter).toString())
  expect(amountIn).to.be.lessThan(amount * (1 + 1e-12))

  const amountOut = outBalanceAfter.sub(outBalanceBefore)
  const amounOutTines = pool.tinesPool.calcOutByIn(amount, direction)
  expect(closeValues(amountOut, amounOutTines.out, 1e-12)).true
}

async function expectToTrow(call: () => Promise<void>) {
  try {
    await call()
    expect(1).to.equal(0) // should not be here - must throw an OutOfLiquidity exception
  } catch (e) {
    expect(e).not.to.undefined
  }
}

describe('Uni V3', () => {
  let env: Environment

  before(async () => {
    env = await createEnv()
  })

  it('Empty pool', async () => {
    const { tinesPool } = await createPool(env, 3000, 1, [])

    expectToTrow(async () => {
      tinesPool.calcOutByIn(100, true)
    })

    expectToTrow(async () => {
      tinesPool.calcOutByIn(100, false)
    })
  })

  it('One position before tick', async () => {
    const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
    await checkSwap(env, pool, 1e16, true)
  })

  it('One position after tick', async () => {
    const pool = await createPool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
    expectToTrow(async () => {
      await checkSwap(env, pool, 1e18, true)
    })
  })
})
