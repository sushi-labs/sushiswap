import { reset } from '@nomicfoundation/hardhat-network-helpers'
import { erc20Abi, routeProcessor2Abi } from '@sushiswap/abi'
import { ChainId } from '@sushiswap/chain'
import { DAI, Native, USDC, WBTC, WETH9, WNATIVE } from '@sushiswap/currency'
import { FactoryV3, LogFilter2, LogFilterType, PoolInfo, UniV3Extractor } from '@sushiswap/extractor'
import { LiquidityProviders, NativeWrapProvider, PoolCode, Router, UniswapV3Provider } from '@sushiswap/router'
import { BASES_TO_CHECK_TRADES_AGAINST } from '@sushiswap/router-config'
import { RouteStatus, UniV3Pool } from '@sushiswap/tines'
import { POOL_INIT_CODE_HASH } from '@sushiswap/v3-sdk'
import INonfungiblePositionManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import ISwapRouter from '@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json'
import { expect } from 'chai'
import { network } from 'hardhat'
import { HardhatNetworkAccountUserConfig } from 'hardhat/types'
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  CustomTransport,
  http,
  Transaction,
  WalletClient,
} from 'viem'
import { Account, privateKeyToAccount } from 'viem/accounts'
import { arbitrum, celo, Chain, hardhat, mainnet, optimism, polygon } from 'viem/chains'

import { setTokenBalance } from '../src'
import { comparePoolCodes, isSubpool } from '../src/ComparePoolCodes'
import { UniswapV3FactoryAddress } from './Extractor.test'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

const PositionManagerAddress: Record<number, Address> = {
  [ChainId.ETHEREUM]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
  [ChainId.POLYGON]: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
}
const SwapRouterAddress: Address = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
export const RP3Address = {
  [ChainId.ETHEREUM]: '0x827179dD56d07A7eeA32e3873493835da2866976' as Address,
  [ChainId.POLYGON]: '0x0a6e511Fe663827b9cA7e2D2542b20B37fC217A6' as Address,
  [ChainId.ARBITRUM]: '0xfc506AaA1340b4dedFfd88bE278bEe058952D674' as Address,
  [ChainId.OPTIMISM]: '0x4C5D5234f232BD2D76B96aA33F5AE4FCF0E4BFAb' as Address,
  [ChainId.CELO]: '0x2f686751b19a9d91cc3d57d90150Bc767f050066' as Address,
}

function uniswapFactory(chain: ChainId): FactoryV3 {
  return {
    address: UniswapV3FactoryAddress[chain] as Address,
    provider: LiquidityProviders.UniswapV3,
    initCodeHash: POOL_INIT_CODE_HASH,
  }
}

export const pancakeswapFactory: FactoryV3 = {
  address: '0x6e229c972d9f69c15bdc7b07f385d2025225e72b' as Address,
  provider: LiquidityProviders.UniswapV3,
  initCodeHash: POOL_INIT_CODE_HASH,
}

const kyberswapFactory: FactoryV3 = {
  address: '0xC7a590291e07B9fe9E64b86c58fD8fC764308C4A' as Address,
  provider: LiquidityProviders.UniswapV3,
  initCodeHash: POOL_INIT_CODE_HASH,
}

const pools: PoolInfo[] = [
  {
    address: '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168',
    token0: DAI[ChainId.ETHEREUM],
    token1: USDC[ChainId.ETHEREUM],
    fee: 100,
    factory: uniswapFactory(ChainId.ETHEREUM),
  },
  {
    address: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
    token0: USDC[ChainId.ETHEREUM],
    token1: WNATIVE[ChainId.ETHEREUM],
    fee: 500,
    factory: uniswapFactory(ChainId.ETHEREUM),
  },
  {
    address: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD',
    token0: WBTC[ChainId.ETHEREUM],
    token1: WNATIVE[ChainId.ETHEREUM],
    fee: 3000,
    factory: uniswapFactory(ChainId.ETHEREUM),
  },
]

const poolSet = new Set(pools.map((p) => p.address.toLowerCase()))

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
    id: 1,
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

  const amount = BigInt(1e28)
  const tokens = [DAI[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], WBTC[ChainId.ETHEREUM]]
  await Promise.all(
    tokens.map(async (t) => {
      const addr = t.address as Address
      await setTokenBalance(addr, user, amount)
      await client.writeContract({
        address: addr as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [PositionManagerAddress[ChainId.ETHEREUM], amount],
      })
      await client.writeContract({
        address: addr as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [SwapRouterAddress, amount],
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
    address: PositionManagerAddress[ChainId.ETHEREUM],
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
    address: PositionManagerAddress[ChainId.ETHEREUM],
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
    address: PositionManagerAddress[ChainId.ETHEREUM],
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
  const collectHash = await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: PositionManagerAddress[ChainId.ETHEREUM],
    abi: INonfungiblePositionManager.abi,
    functionName: 'collect',
    args: [CollectParams],
  })
  return client.getTransaction({ hash: collectHash })
}

async function Swap(env: TestEnvironment, pool: UniV3Pool, direction: boolean, amountIn: bigint): Promise<Transaction> {
  const ExactInputSingleParams = {
    tokenIn: direction ? pool.token0.address : pool.token1.address,
    tokenOut: direction ? pool.token1.address : pool.token0.address,
    fee: pool.fee * 1e6,
    recipient: env.user,
    deadline: 1e12,
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  }
  const hash = await env.client.writeContract({
    account: env.user,
    chain: env.chain,
    address: SwapRouterAddress,
    abi: ISwapRouter.abi,
    functionName: 'exactInputSingle',
    args: [ExactInputSingleParams],
  })
  const client = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })
  return client.getTransaction({ hash })
}

async function makeTest(
  env: TestEnvironment,
  sendEvents: (env: TestEnvironment, pc: UniV3Pool) => Promise<Transaction> | undefined
) {
  const client = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })

  const logFilter = new LogFilter2(client, 50, LogFilterType.Native)
  const extractor = new UniV3Extractor(
    client,
    '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    [uniswapFactory(ChainId.ETHEREUM)],
    '',
    logFilter,
    false
  )
  await extractor.start()
  pools.forEach((p) => extractor.addPoolWatching(p, 'request'))
  for (;;) {
    if (extractor.getStablePoolCodes().length === pools.length) break
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
      if (Number(extractor.lastProcessdBlock) >= blockNumber && extractor.getStablePoolCodes().length === pools.length)
        break
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
    const ep = extractorPools.find((p) => p.pool.address === pp.pool.address)
    expect(ep).not.undefined
    if (ep) comparePoolCodes(pp, ep)
  })

  logFilter.stop(false)
}

async function checkHistoricalLogs(env: TestEnvironment, pool: PoolInfo, fromBlock: bigint, toBlock: bigint) {
  const transport = http(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`)
  const client = createPublicClient({
    chain: mainnet,
    transport,
  })

  const logs = await client.getLogs({
    address: pool.address,
    fromBlock,
    toBlock,
  })
  //console.log(logs.length)

  await reset(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`, fromBlock)
  const clientPrimary = createPublicClient({
    chain: env.chain,
    transport: env.transport,
  })

  const extractor = new UniV3Extractor(
    clientPrimary,
    '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    [uniswapFactory(ChainId.ETHEREUM)],
    '',
    {
      addFilter: () => {
        //
      },
      start: () => {
        //
      },
    } as unknown as LogFilter2,
    false
  )
  await extractor.start()
  extractor.addPoolWatching(pool, 'request')
  for (;;) {
    if (extractor.getStablePoolCodes().length === 1) break
    await delay(500)
  }

  logs.forEach((l) => extractor.processLog(l))
  for (;;) {
    if (extractor.getStablePoolCodes().length === 1) break
    await delay(500)
  }

  await reset(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`, toBlock)

  const uniProvider = new UniswapV3Provider(ChainId.ETHEREUM, clientPrimary)
  await uniProvider.fetchPoolsForToken(USDC[ChainId.ETHEREUM], WETH9[ChainId.ETHEREUM], {
    has: (poolAddress: string) => poolAddress !== pool.address,
  })
  const providerPools = uniProvider.getCurrentPoolList()

  isSubpool(providerPools[0], extractor.getStablePoolCodes()[0])

  //await reset(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`, fromBlock)
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

  it('swap small direction=true', async () => {
    await makeTest(env, (env, pool) => {
      return Swap(env, pool, true, BigInt(1e10))
    })
  })

  it('swap small direction=false', async () => {
    await makeTest(env, (env, pool) => {
      return Swap(env, pool, false, BigInt(1e10))
    })
  })

  it('swap middle (overlapped word diapason)', async () => {
    await makeTest(env, (env, pool) => {
      switch (pool.address) {
        case '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168':
          return Swap(env, pool, true, BigInt(5e25))
        default:
        //expect(true).equal(false, `unexpected pool ${pool.address}`)
      }
    })
  })

  it('swap huge (new words diapason)', async () => {
    await makeTest(env, (env, pool) => {
      switch (pool.address) {
        case '0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168':
          return Swap(env, pool, true, BigInt(1e26))
        case '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640':
          return Swap(env, pool, true, BigInt(3e13))
        case '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD':
          return Swap(env, pool, true, BigInt(1e18))
        default:
        //expect(true).equal(false, `unexpected pool ${pool.address}`)
      }
    })
  })

  it('pool #1 historical logs (1582)', async () => {
    await checkHistoricalLogs(env, pools[0], 17390000n, 17450000n)
  })

  it('pool #2 historical logs (9525)', async () => {
    await checkHistoricalLogs(env, pools[1], 17390000n, 17410000n)
  })

  it('pool #3 historical logs (1953)', async () => {
    await checkHistoricalLogs(env, pools[2], 17390000n, 17450000n)
  })
})

async function startInfinitTest(args: {
  providerURL: string
  chain: Chain
  factories: FactoryV3[]
  tickLensContract: Address
  RP3Address: Address
  logDepth: number
  account?: Address
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = client.chain?.id as ChainId

  const logFilter = new LogFilter2(this.client, args.logDepth, LogFilterType.OneCall)
  const extractor = new UniV3Extractor(client, args.tickLensContract, args.factories, './cache', logFilter)
  await extractor.start()
  extractor.getWatchersForTokens(BASES_TO_CHECK_TRADES_AGAINST[chainId])

  const nativeProvider = new NativeWrapProvider(chainId, client)
  const tokens = BASES_TO_CHECK_TRADES_AGAINST[chainId]
  for (;;) {
    for (let i = 1; i < tokens.length; ++i) {
      await delay(1000)
      const { prefetched: watchers } = extractor.getWatchersForTokens(tokens)
      const pools = watchers.map((w) => w.getPoolCode()).filter((pc) => pc !== undefined) as PoolCode[]
      const poolMap = new Map<string, PoolCode>()
      pools.forEach((p) => poolMap.set(p.pool.address, p))
      nativeProvider.getCurrentPoolList().forEach((p) => poolMap.set(p.pool.address, p))
      const fromToken = Native.onChain(chainId),
        toToken = tokens[i]
      const route = Router.findBestRoute(poolMap, chainId, fromToken, BigInt(1e18), toToken, 30e9)
      if (route.status === RouteStatus.NoWay) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status}`)
        continue
      }
      const rpParams = Router.routeProcessor2Params(
        poolMap,
        route,
        fromToken,
        toToken,
        args.RP3Address,
        args.RP3Address
      )
      if (rpParams === undefined) {
        console.log(`Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`)
        continue
      }
      try {
        const amountOutReal = await client
          .simulateContract({
            address: args.RP3Address,
            abi: routeProcessor2Abi,
            functionName: 'processRoute',
            args: [
              rpParams.tokenIn as Address,
              BigInt(rpParams.amountIn.toString()),
              rpParams.tokenOut as Address,
              0n,
              rpParams.to as Address,
              rpParams.routeCode as Address, // !!!!
            ],
            value: BigInt(rpParams.value?.toString() as string),
            account: args.account,
          })
          .then((r) => r.result)
        const amountOutExp = BigInt(route.amountOutBI.toString())
        const diff =
          amountOutExp === 0n ? amountOutReal - amountOutExp : Number(amountOutReal - amountOutExp) / route.amountOut
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.legs.length - 1} pools` +
            ` diff = ${diff > 0 ? '+' : ''}${diff}`
        )
        if (Math.abs(Number(diff)) > 0.001) console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
      } catch (e) {
        console.log('Routing failed. No connection ?')
      }
    }
  }
}

it.skip('UniV3 Extractor Ethereum infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factories: [uniswapFactory(ChainId.ETHEREUM), kyberswapFactory],
    tickLensContract: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    RP3Address: RP3Address[ChainId.ETHEREUM],
    logDepth: 50,
  })
})

it.skip('UniV3 Extractor Polygon infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: polygon,
    factories: [uniswapFactory(ChainId.POLYGON)],
    tickLensContract: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    RP3Address: RP3Address[ChainId.POLYGON],
    logDepth: 100,
  })
})

it.skip('UniV3 Extractor Arbitrum infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: arbitrum,
    factories: [uniswapFactory(ChainId.ARBITRUM)],
    tickLensContract: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    RP3Address: RP3Address[ChainId.ARBITRUM],
    logDepth: 300,
  })
})

it.skip('UniV3 Extractor Optimism infinit work test', async () => {
  await startInfinitTest({
    providerURL: `https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
    chain: optimism,
    factories: [uniswapFactory(ChainId.OPTIMISM)],
    tickLensContract: '0xbfd8137f7d1516d3ea5ca83523914859ec47f573',
    RP3Address: RP3Address[ChainId.OPTIMISM],
    logDepth: 50,
    account: '0x4200000000000000000000000000000000000006', // just a whale because optimism eth_call needs gas (
  })
})

it.skip('UniV3 Extractor Celo infinit work test', async () => {
  await startInfinitTest({
    providerURL: 'https://forno.celo.org',
    chain: celo,
    factories: [uniswapFactory(ChainId.CELO)],
    tickLensContract: '0x5f115D9113F88e0a0Db1b5033D90D4a9690AcD3D',
    RP3Address: RP3Address[ChainId.CELO],
    logDepth: 50,
  })
})
