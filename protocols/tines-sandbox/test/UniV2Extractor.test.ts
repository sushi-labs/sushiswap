import {
  FactoryV2,
  LogFilter2,
  LogFilterType,
  TokenManager,
  UniV2Extractor,
} from '@sushiswap/extractor'
import { routeProcessor2Abi_processRoute } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { BASES_TO_CHECK_TRADES_AGAINST } from 'sushi/config'
import { Native } from 'sushi/currency'
import {
  LiquidityProviders,
  NativeWrapProvider,
  PoolCode,
  Router,
} from 'sushi/router'
import { RouteStatus } from 'sushi/tines'
import { http, Address, createPublicClient } from 'viem'
import { Chain, mainnet } from 'viem/chains'
import { RP3Address } from './UniV3Extractor.test.js'

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function startInfinitTest(args: {
  providerURL: string
  chain: Chain
  factories: FactoryV2[]
  RP3Address: Address
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const chainId = client.chain?.id as ChainId

  const logFilter = new LogFilter2(this.client, 200, LogFilterType.OneCall)
  const extractor = new UniV2Extractor(
    client,
    args.factories,
    './cache',
    logFilter,
  )
  await extractor.start()

  const nativeProvider = new NativeWrapProvider(chainId, client)
  const tokenManager = new TokenManager(
    extractor.multiCallAggregator,
    `./cache/uniV3Tokens-${client.chain?.id}`,
  )
  await tokenManager.addCachedTokens()
  const tokens = Array.from(tokenManager.tokens.values())
  for (;;) {
    for (let i = 1; i < tokens.length; ++i) {
      await delay(1000)
      const time0 = performance.now()
      const { prefetched: pools0, fetching: poolsPromise } =
        extractor.getPoolsForTokens(
          BASES_TO_CHECK_TRADES_AGAINST[chainId].concat([tokens[i]]),
        )
      const time1 = performance.now()
      const pools1 = (await Promise.all(poolsPromise)).filter(
        (p): p is NonNullable<typeof p> => p !== undefined,
      )
      const time2 = performance.now()
      console.log(
        `Timing: ${pools0.length} pools ${Math.round(time1 - time0)}ms, ${
          pools1.length
        } pools ${Math.round(time2 - time1)}ms`,
      )
      const pools = pools0.concat(pools1)
      const poolMap = new Map<string, PoolCode>()
      pools.forEach((p) => poolMap.set(p.pool.address, p))
      nativeProvider
        .getCurrentPoolList()
        .forEach((p) => poolMap.set(p.pool.address, p))
      const fromToken = Native.onChain(chainId)
      const toToken = tokens[i]
      const route = Router.findBestRoute(
        poolMap,
        chainId,
        fromToken,
        BigInt(1e18),
        toToken,
        30e9,
      )
      if (route.status === RouteStatus.NoWay) {
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status}`,
        )
        continue
      }
      const rpParams = Router.routeProcessor2Params(
        poolMap,
        route,
        fromToken,
        toToken,
        args.RP3Address,
        args.RP3Address,
      )
      if (rpParams === undefined) {
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${route.status} ROUTE CREATION FAILED !!!`,
        )
        continue
      }
      try {
        const amountOutReal = await client
          .simulateContract({
            address: args.RP3Address,
            abi: routeProcessor2Abi_processRoute,
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
          })
          .then((r) => r.result)

        const amountOutExp = BigInt(route.amountOutBI.toString())
        const diff =
          amountOutExp === 0n
            ? amountOutReal - amountOutExp
            : Number(amountOutReal - amountOutExp) / route.amountOut
        console.log(
          `Routing: ${fromToken.symbol} => ${toToken.symbol} ${
            route.legs.length - 1
          } pools diff = ${diff > 0 ? '+' : ''}${diff}`,
        )
        if (Math.abs(Number(diff)) > 0.001)
          console.log('Routing: TOO BIG DIFFERENCE !!!!!!!!!!!!!!!!!!!!!')
      } catch (_e) {
        console.log('Routing failed. No connection ?')
      }
    }
  }
}

async function allPoolsPrefetchingTest(args: {
  providerURL: string
  chain: Chain
  factories: FactoryV2[]
}) {
  const transport = http(args.providerURL)
  const client = createPublicClient({
    chain: args.chain,
    transport: transport,
  })
  const logFilter = new LogFilter2(this.client, 200, LogFilterType.OneCall)
  const extractor = new UniV2Extractor(
    client,
    args.factories,
    './cache',
    logFilter,
  )
  await extractor.start()
  const start = performance.now()
  await extractor.addPoolsFromFactory(args.factories[0].address)
  console.log(
    `addPoolsFromFactory test: ${Math.round(performance.now() - start)}ms`,
  )
}

it.skip('UniV2 Extractor Ethereum infinite work test', async () => {
  await startInfinitTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factories: [
      {
        address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        provider: LiquidityProviders.UniswapV2,
        fee: 0.003,
        initCodeHash:
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
    ],
    RP3Address: RP3Address[ChainId.ETHEREUM],
  })
})

it.skip('UniV2 Extractor Ethereum allPoolsPrefetching test', async () => {
  await allPoolsPrefetchingTest({
    providerURL: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_ID}`,
    chain: mainnet,
    factories: [
      {
        address: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        provider: LiquidityProviders.UniswapV2,
        fee: 0.003,
        initCodeHash:
          '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
      },
    ],
  })
})
