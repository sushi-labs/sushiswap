import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'
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

// Map of fee to tickSpacing
const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

export interface UniV3Environment {
  ethers: HardHatEthersType
  user: Signer
  tokenFactory: ContractFactory
  UniV3Factory: Contract
  positionManager: Contract
  testRouter: Contract
}

type HardHatEthersType = typeof ethers & HardhatEthersHelpers

export async function createUniV3Env(
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
  const testRouter = await TestRouterFactory.deploy()
  await testRouter.deployed()

  return {
    ethers,
    user,
    tokenFactory,
    UniV3Factory,
    positionManager,
    testRouter,
  }
}

export interface UniV3Position {
  from: number
  to: number
  val: number
}

export interface UniV3PoolInfo {
  contract: Contract
  tinesPool: UniV3Pool
  token0Contract: Contract
  token1Contract: Contract
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
  const token0: RToken = {
    chainId,
    name: 'Token0',
    symbol: 'Token0',
    address: token0Contract.address,
  }
  const token1: RToken = { chainId, name: 'Token1', symbol: 'Token1', address: token1Contract.address }

  await token0Contract.approve(env.testRouter.address, tokenSupply)
  await token1Contract.approve(env.testRouter.address, tokenSupply)

  await env.positionManager.createAndInitializePoolIfNecessary(
    token0Contract.address,
    token1Contract.address,
    getBigNumber(fee),
    sqrtPriceX96
  )

  const poolAddress = await env.UniV3Factory.getPool(token0Contract.address, token1Contract.address, fee)
  const poolF = await env.ethers.getContractFactory(UniswapV3Pool.abi, UniswapV3Pool.bytecode)
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

function getRndLin(rnd: () => number, min: number, max: number) {
  return rnd() * (max - min) + min
}
function getRndLinInt(rnd: () => number, min: number, max: number) {
  return Math.floor(getRndLin(rnd, min, max))
}

export async function createRandomUniV3Pool(
  env: UniV3Environment,
  seed: string,
  positionNumber: number,
  price?: number
): Promise<UniV3PoolInfo> {
  const rnd: () => number = seedrandom(seed) // random [0, 1)

  const fee = [500, 3000, 10000][getRndLinInt(rnd, 0, 3)]
  const tickSpacing = feeAmountTickSpacing[fee]
  const RANGE = Math.floor((CL_MAX_TICK - CL_MIN_TICK) / tickSpacing)
  const SHIFT = -Math.floor(-CL_MIN_TICK / tickSpacing) * tickSpacing

  const positions: UniV3Position[] = []
  for (let i = 0; i < positionNumber; ++i) {
    const pos1 = getRndLinInt(rnd, 0, RANGE)
    const pos2 = (pos1 + getRndLinInt(rnd, 1, RANGE - 1)) % RANGE
    const from = Math.min(pos1, pos2) * tickSpacing + SHIFT
    const to = Math.max(pos1, pos2) * tickSpacing + SHIFT
    console.assert(CL_MIN_TICK <= from && from < to && to <= CL_MAX_TICK, `Wrong from-to range ${from} - ${to}`)
    positions.push({ from, to, val: getRndLin(rnd, 0.01, 30) * 1e18 })
  }
  price = price === undefined ? getRndLin(rnd, 0.01, 100) : price
  //console.log(positions, price, fee)
  return await createUniV3Pool(env, fee, price, positions)
}
