import { erc20Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { DAI, USDC, WBTC, WETH9, WNATIVE } from '@sushiswap/currency'
import { PoolInfo, UniV3Extractor } from '@sushiswap/extractor'
import { PoolCode, UniswapV3Provider } from '@sushiswap/router'
import { UniV3Pool } from '@sushiswap/tines'
import INonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import { expect } from 'chai'
import { network } from 'hardhat'
import { HardhatNetworkAccountUserConfig } from 'hardhat/types'
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  CustomTransport,
  Transaction,
  WalletClient,
} from 'viem'
import { Account, privateKeyToAccount } from 'viem/accounts'
import { Chain, hardhat } from 'viem/chains'

import { setTokenBalance } from '../src'
import { comparePoolCodes } from '../src/ComparePoolCodes'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

const pools: PoolInfo[] = [
  {
    address: '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
    token0: DAI[ChainId.ETHEREUM],
    token1: USDC[ChainId.ETHEREUM],
    fee: 100,
  },
  {
    address: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
    token0: USDC[ChainId.ETHEREUM],
    token1: WNATIVE[ChainId.ETHEREUM],
    fee: 500,
  },
  {
    address: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD',
    token0: WBTC[ChainId.ETHEREUM],
    token1: WNATIVE[ChainId.ETHEREUM],
    fee: 3000,
  },
]

const poolSet = new Set(pools.map((p) => p.address.toLowerCase()))
const NonfungiblePositionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88' as '0x${string}'

interface TestEnvironment {
  account: Account
  chain: Chain
  transport: CustomTransport
  client: WalletClient
  user: Address
}

async function prepareEnvironment(): Promise<TestEnvironment> {
  const privateKey = (network.config.accounts as HardhatNetworkAccountUserConfig[])[0].privateKey as '0x${string}'
  const account = privateKeyToAccount(privateKey)
  const chain: Chain = {
    ...hardhat,
    contracts: {
      multicall3: {
        address: '0xca11bde05977b3631167028862be2a173976ca11',
        blockCreated: 14353601,
      },
    },
  }
  const transport = custom(network.provider)
  const client = createWalletClient({
    chain,
    transport,
    account,
  })
  const [user] = await client.getAddresses()

  const tokens = [DAI[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], WBTC[ChainId.ETHEREUM]]
  await Promise.all(
    tokens.map(async (t) => {
      await setTokenBalance(t.address, user, BigInt(1e24))
      await client.writeContract({
        address: t.address as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [NonfungiblePositionManagerAddress as Address, BigInt(1e24)],
      })
    })
  )

  return {
    account,
    chain,
    transport,
    client,
    user,
  }
}

async function Mint(
  env: TestEnvironment,
  pool: UniV3Pool,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint
): Promise<Transaction> {
  const MintParams = {
    token0: pool.token0.address,
    token1: pool.token1.address,
    fee: pool.fee * 1e6,
    tickLower,
    tickUpper,
    amount0Desired: liquidity,
    amount1Desired: liquidity,
    amount0Min: 0,
    amount1Min: 0,
    recipient: env.user,
    deadline: 1e12,
  }
  const hash = await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: NonfungiblePositionManagerAddress as Address,
    abi: INonfungiblePositionManager.abi,
    functionName: 'mint',
    args: [MintParams],
  })
  const client = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })
  return client.getTransaction({ hash })
}

async function MintAndBurn(
  env: TestEnvironment,
  pool: UniV3Pool,
  tickLower: number,
  tickUpper: number,
  liquidity: bigint
): Promise<Transaction> {
  const MintParams = {
    token0: pool.token0.address,
    token1: pool.token1.address,
    fee: pool.fee * 1e6,
    tickLower,
    tickUpper,
    amount0Desired: liquidity,
    amount1Desired: liquidity,
    amount0Min: 0,
    amount1Min: 0,
    recipient: env.user,
    deadline: 1e12,
  }
  const hashMint = await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: NonfungiblePositionManagerAddress as Address,
    abi: INonfungiblePositionManager.abi,
    functionName: 'mint',
    args: [MintParams],
  })

  const client = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })
  const rct = await client.getTransactionReceipt({ hash: hashMint })
  const increaseLiquidityLog = rct.logs[rct.logs.length - 1]
  const tokenId = parseInt(increaseLiquidityLog.topics[1] as string)
  const placedLiquidity = BigInt(increaseLiquidityLog.data.substring(0, 66))

  const DecreaseParams = {
    tokenId,
    liquidity: placedLiquidity,
    amount0Min: 0,
    amount1Min: 0,
    deadline: 1e12,
  }
  await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: NonfungiblePositionManagerAddress as Address,
    abi: INonfungiblePositionManager.abi,
    functionName: 'decreaseLiquidity',
    args: [DecreaseParams],
  })

  const CollectParams = {
    tokenId,
    recipient: env.user,
    amount0Max: BigInt(1e30),
    amount1Max: BigInt(1e30),
  }
  await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: NonfungiblePositionManagerAddress as Address,
    abi: INonfungiblePositionManager.abi,
    functionName: 'collect',
    args: [CollectParams],
  })

  const hashBurn = await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: NonfungiblePositionManagerAddress as Address,
    abi: INonfungiblePositionManager.abi,
    functionName: 'burn',
    args: [tokenId],
  })
  return client.getTransaction({ hash: hashBurn })
}

async function makeTest(
  env: TestEnvironment,
  sendEvents: (env: TestEnvironment, pc: UniV3Pool) => Promise<Transaction> | undefined
) {
  const client = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })

  const extractor = new UniV3Extractor(client, 'UniswapV3', '0xbfd8137f7d1516d3ea5ca83523914859ec47f573')
  extractor.start(pools)
  for (;;) {
    if (extractor.getStablePoolCodes().length == pools.length) break
    await delay(500)
  }

  let extractorPools = extractor.getStablePoolCodes()
  const transactions = (
    await Promise.all(
      extractor.getStablePoolCodes().map(async (pc) => {
        const tinesPool = pc.pool as UniV3Pool
        return sendEvents(env, tinesPool)
      })
    )
  ).filter((tr) => tr !== undefined) as Transaction[]

  if (transactions.length > 0) {
    const blockNumber = Math.max(...transactions.map((tr) => Number(tr.blockNumber || 0)))
    for (;;) {
      if (Number(extractor.lastProcessdBlock) == blockNumber) break
      await delay(500)
    }
  }

  const uniProvider = new UniswapV3Provider(ChainId.ETHEREUM, client)
  await uniProvider.fetchPoolsForToken(USDC[ChainId.ETHEREUM], WETH9[ChainId.ETHEREUM], {
    has: (poolAddress: string) => !poolSet.has(poolAddress.toLowerCase()),
  })
  const providerPools = uniProvider.getCurrentPoolList()

  extractorPools = extractor.getStablePoolCodes()
  providerPools.forEach((pp) => {
    const ep = extractorPools.find((p) => p.pool.address == pp.pool.address)
    expect(ep).not.undefined
    if (ep) comparePoolCodes(pp, ep)
  })
}

describe('UniV3Extractor', () => {
  let env: TestEnvironment

  before(async () => {
    env = await prepareEnvironment()
  })

  it('pools downloading', async () => {
    await makeTest(env, () => undefined)
  })

  it('mint around event', async () => {
    await makeTest(env, (env, pool) => {
      const currentTick = pool.ticks[pool.nearestTick].index
      return Mint(env, pool, currentTick - 600, currentTick + 600, BigInt(1e8))
    })
  })

  it('mint before event', async () => {
    await makeTest(env, (env, pool) => {
      const currentTick = pool.ticks[pool.nearestTick].index
      return Mint(env, pool, currentTick - 900, currentTick - 60, BigInt(1e9))
    })
  })

  it('mint after event', async () => {
    await makeTest(env, (env, pool) => {
      const currentTick = pool.ticks[pool.nearestTick].index
      return Mint(env, pool, currentTick + 120, currentTick + 6000, BigInt(1e10))
    })
  })

  it('mint x2 event', async () => {
    await makeTest(env, (env, pool) => {
      const currentTick = pool.ticks[pool.nearestTick].index
      Mint(env, pool, currentTick - 300, currentTick, BigInt(1e8))
      return Mint(env, pool, currentTick, currentTick + 300, BigInt(1e10))
    })
  })

  it('mint and burn', async () => {
    await makeTest(env, (env, pool) => {
      const currentTick = pool.ticks[pool.nearestTick].index
      return MintAndBurn(env, pool, currentTick - 540, currentTick + 540, BigInt(1e10))
    })
  })
})
