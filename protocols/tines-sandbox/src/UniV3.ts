import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { CL_MAX_TICK, CL_MIN_TICK, CLTick, getBigNumber, RToken, UniV3Pool } from '@sushiswap/tines'
import NonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import WETH9 from 'canonical-weth/build/contracts/WETH9.json'
import { expect } from 'chai'
import { BigNumber, Contract, ContractFactory, ethers, Signer } from 'ethers'
import seedrandom from 'seedrandom'

import ERC20Mock from '../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json'
import TestRouter from '../artifacts/contracts/TestRouter.sol/TestRouter.json'
import UniswapV3Factory from '../artifacts/contracts/UniswapV3FactoryFlat.sol/UniswapV3Factory.json'
import UniswapV3Pool from '../artifacts/contracts/UniswapV3FactoryFlat.sol/UniswapV3Pool.json'

const ZERO = getBigNumber(0)

const UniswapV3FactoryAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON]: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
}

const PositionManagerAddress: Record<number, string> = {
  [ChainId.ETHEREUM]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [ChainId.POLYGON]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}

export const possibleFee: number[] = [100, 500, 3000, 10000]

// Map of fee to tickSpacing
export const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[100] = 1 // 0.01%
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

export interface UniV3Environment {
  ethers: HardHatEthersType
  user: Signer
  tokenFactory: ContractFactory
  UniV3Factory: Contract
  positionManager: Contract
  swapper: Contract
  minter: Contract
  mint: (pool: UniV3PoolInfo, from: number, to: number, liquidity: BigNumber) => Promise<BigNumber>
}

type HardHatEthersType = typeof ethers & HardhatEthersHelpers

// Makes artificial environment, deploys factory, smallpositionmanager for mint and swap
export async function createUniV3EnvZero(
  ethers: HardHatEthersType,
  userDeployContracts?: Signer
): Promise<UniV3Environment> {
  const user = userDeployContracts || (await ethers.getSigners())[0]

  const tokenFactory = await ethers.getContractFactory(ERC20Mock.abi, ERC20Mock.bytecode, user)

  const UniV3FactoryFactory = await ethers.getContractFactory(UniswapV3Factory.abi, UniswapV3Factory.bytecode)
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

  const TestRouterFactory = await ethers.getContractFactory(TestRouter.abi, TestRouter.bytecode)
  const minter = await TestRouterFactory.deploy()
  await minter.deployed()

  return {
    ethers,
    user,
    tokenFactory,
    UniV3Factory,
    positionManager,
    swapper: minter,
    minter,
    mint: async (pool: UniV3PoolInfo, from: number, to: number, liquidity: BigNumber) => {
      await pool.env.minter.mint(pool.contract.address, from, to, liquidity)
      return liquidity
    },
  }
}

// Uses real environment
export async function createUniV3EnvReal(
  ethers: HardHatEthersType,
  userDeployContracts?: Signer
): Promise<UniV3Environment | undefined> {
  const user = userDeployContracts || (await ethers.getSigners())[0]
  const provider = user.provider
  if (provider === undefined) return
  const chainId = (await provider.getNetwork()).chainId
  if (UniswapV3FactoryAddress[chainId] === undefined || PositionManagerAddress[chainId] === undefined) return
  const tokenFactory = await ethers.getContractFactory(ERC20Mock.abi, ERC20Mock.bytecode, user)
  const UniV3FactoryFactory = await ethers.getContractFactory(UniswapV3Factory.abi, UniswapV3Factory.bytecode)
  const UniV3Factory = UniV3FactoryFactory.attach(UniswapV3FactoryAddress[chainId])
  const pmFactory = await ethers.getContractFactory(NonfungiblePositionManager.abi, NonfungiblePositionManager.bytecode)
  const positionManager = pmFactory.attach(PositionManagerAddress[chainId])

  const TestRouterFactory = await ethers.getContractFactory(TestRouter.abi, TestRouter.bytecode)
  const minter = await TestRouterFactory.deploy()
  await minter.deployed()

  return {
    ethers,
    user,
    tokenFactory,
    UniV3Factory,
    positionManager,
    swapper: minter,
    minter,
    mint: async (pool: UniV3PoolInfo, from: number, to: number, liquidity: BigNumber) => {
      const MintParams = {
        token0: pool.token0Contract.address,
        token1: pool.token1Contract.address,
        fee: pool.fee,
        tickLower: from,
        tickUpper: to,
        amount0Desired: liquidity,
        amount1Desired: liquidity,
        amount0Min: 0,
        amount1Min: 0,
        recipient: await pool.env.user.getAddress(),
        deadline: 1e12,
      }

      let res
      try {
        res = await positionManager.mint(MintParams)
      } catch (e) {
        return ZERO
      }
      const receipt = await res.wait()

      // event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1);
      const increaseLiquidityEvent = receipt.events.find(
        (ev: { topics: string[] }) =>
          ev.topics[0] == '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f'
      )
      const liquidityReal = BigNumber.from(increaseLiquidityEvent.data.substring(0, 66))
      return liquidityReal
    },
  }
}

export interface UniV3Position {
  from: number
  to: number
  val: number
}

export interface UniV3PoolInfo {
  env: UniV3Environment
  contract: Contract
  fee: number
  tinesPool: UniV3Pool
  token0Contract: Contract
  token1Contract: Contract
  token0: Token
  token1: Token
}

function isLess(a: Contract, b: Contract): boolean {
  const addrA = a.address.toLowerCase().substring(2).padStart(40, '0')
  const addrB = b.address.toLowerCase().substring(2).padStart(40, '0')
  return addrA < addrB
}

const tokenSupply = getBigNumber(Math.pow(2, 255))
export async function createUniV3Pool(
  env: UniV3Environment,
  fee: number,
  price: number,
  positions: UniV3Position[]
): Promise<UniV3PoolInfo> {
  const sqrtPriceX96 = getBigNumber(Math.sqrt(price) * Math.pow(2, 96))
  const tickSpacing = feeAmountTickSpacing[fee]
  expect(tickSpacing).not.undefined

  const _token0Contract = await env.tokenFactory.deploy('Token0', 'Token0', tokenSupply)
  const _token1Contract = await env.tokenFactory.deploy('Token1', 'Token1', tokenSupply)
  const [token0Contract, token1Contract] = isLess(_token0Contract, _token1Contract)
    ? [_token0Contract, _token1Contract]
    : [_token1Contract, _token0Contract]

  const chainId = env.ethers.provider.network.chainId
  const token0 = new Token({
    chainId,
    address: token0Contract.address,
    symbol: 'Token0',
    name: 'Token0',
    decimals: 18,
  })
  const token1 = new Token({
    chainId,
    address: token1Contract.address,
    symbol: 'Token1',
    name: 'Token1',
    decimals: 18,
  })

  await token0Contract.approve(env.minter.address, tokenSupply)
  await token1Contract.approve(env.minter.address, tokenSupply)
  await token0Contract.approve(env.positionManager.address, tokenSupply)
  await token1Contract.approve(env.positionManager.address, tokenSupply)

  await env.positionManager.createAndInitializePoolIfNecessary(
    token0Contract.address,
    token1Contract.address,
    getBigNumber(fee),
    sqrtPriceX96
  )

  const poolAddress = await env.UniV3Factory.getPool(token0Contract.address, token1Contract.address, fee)
  const poolF = await env.ethers.getContractFactory(UniswapV3Pool.abi, UniswapV3Pool.bytecode)
  const pool = poolF.attach(poolAddress)

  const poolInfo = {
    env,
    contract: pool,
    fee,
    tinesPool: undefined as unknown as UniV3Pool,
    token0Contract,
    token1Contract,
    token0,
    token1,
  }

  const tickMap = new Map<number, BigNumber>()
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    expect(position.from % tickSpacing).to.equal(0)
    expect(position.to % tickSpacing).to.equal(0)

    const liquidityExpected = getBigNumber(position.val)
    const liquidity = await env.mint(poolInfo, position.from, position.to, liquidityExpected)

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

  poolInfo.tinesPool = new UniV3Pool(
    pool.address,
    token0 as RToken,
    token1 as RToken,
    fee / 1e6,
    await token0Contract.balanceOf(pool.address),
    await token1Contract.balanceOf(pool.address),
    slot[1],
    await pool.liquidity(),
    sqrtPriceX96,
    ticks
  )

  return poolInfo
}

function getRndLin(rnd: () => number, min: number, max: number) {
  return rnd() * (max - min) + min
}
export function getRndLinInt(rnd: () => number, min: number, max: number) {
  return Math.floor(getRndLin(rnd, min, max))
}

export async function createRandomUniV3Pool(
  env: UniV3Environment,
  seed: string,
  positionNumber: number,
  price?: number,
  _fee?: number,
  minTick = CL_MIN_TICK,
  maxTick = CL_MAX_TICK
): Promise<UniV3PoolInfo> {
  const rnd: () => number = seedrandom(seed) // random [0, 1)

  const fee = _fee || possibleFee[getRndLinInt(rnd, 0, possibleFee.length)]
  const tickSpacing = feeAmountTickSpacing[fee]
  const RANGE = Math.floor((maxTick - minTick) / tickSpacing)
  const SHIFT = -Math.floor(-minTick / tickSpacing) * tickSpacing

  const positions: UniV3Position[] = []
  for (let i = 0; i < positionNumber; ++i) {
    const pos1 = getRndLinInt(rnd, 0, RANGE)
    const pos2 = (pos1 + getRndLinInt(rnd, 1, RANGE - 1)) % RANGE
    const from = Math.min(pos1, pos2) * tickSpacing + SHIFT
    const to = Math.max(pos1, pos2) * tickSpacing + SHIFT
    console.assert(minTick <= from && from < to && to <= maxTick, `Wrong from-to range ${from} - ${to}`)
    positions.push({ from, to, val: getRndLin(rnd, 0.01, 30) * 1e18 })
  }
  price = price === undefined ? getRndLin(rnd, 0.01, 100) : price
  //console.log(positions, price, fee)
  return await createUniV3Pool(env, fee, price, positions)
}
