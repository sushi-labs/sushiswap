import './env.js'

import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { ChainId } from '@sushiswap/chain'
import { Native, nativeCurrencyIds } from '@sushiswap/currency'
import { createClient } from '@sushiswap/database'
import { isRouteProcessorChainId, routeProcessorAddress, RouteProcessorChainId } from '@sushiswap/route-processor'
import {
  // findSpecialRoute,
  DataFetcher,
  Router,
} from '@sushiswap/router'
import {
  arbitrum,
  arbitrumNova,
  avalanche,
  boba,
  bobaAvax,
  bobaBnb,
  bsc,
  bttc,
  celo,
  fantom,
  fuse,
  gnosis,
  harmony,
  kava,
  mainnet,
  metis,
  moonbeam,
  moonriver,
  optimism,
  polygon,
} from '@sushiswap/viem-config'
import { BigNumber } from 'ethers'
import { fastify } from 'fastify'
import { performance } from 'perf_hooks'
// import { createPublicClient, http } from 'viem'
// import { arbitrum, bsc, celo, mainnet, optimism, polygon } from 'viem/chains'
import { createPublicClient, fallback, http, PublicClient } from 'viem'
import { z } from 'zod'

import { getToken } from './tokens.js'

const server = fastify({ logger: true })
server.register(cors)
// eslint-disable-next-line
// @ts-ignore default export not working
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
})

const dataFetcherMap = new Map<ChainId, DataFetcher>()

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine((chainId) => isRouteProcessorChainId(chainId), { message: 'ChainId not supported.' })
    .transform((chainId) => chainId as RouteProcessorChainId),
  fromTokenId: z.string().default(nativeCurrencyIds[ChainId.ETHEREUM]),
  toTokenId: z.string().default('SUSHI'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.bigint(),
  to: z.optional(z.string()),
  preferSushi: z.coerce.boolean().default(false),
})

// Declare a route
server.get('/v0', async (request) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to, preferSushi } = querySchema.parse(request.query)
  // console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to })
  const tokenStartTime = performance.now()
  const [fromToken, toToken] = await Promise.all([getToken(chainId, fromTokenId), getToken(chainId, toTokenId)])
  const tokenEndTime = performance.now()
  console.log(`tokens (${(tokenEndTime - tokenStartTime).toFixed(0)} ms) `)

  const dataFetcher = dataFetcherMap.get(chainId)
  if (!dataFetcher) {
    throw new Error(`Unsupported chainId ${chainId}`)
  }
  const routeStartTime = performance.now()
  const poolCodesMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)

  const bestRoute = Router[preferSushi ? 'findSpecialRoute' : 'findBestRoute'](
    poolCodesMap,
    chainId,
    fromToken,
    BigNumber.from(amount.toString()),
    toToken,
    gasPrice ?? 30e9
  )

  // if (bestRoute.status !== 'NoWay') {
  //   dataFetcher.fetchPoolsForToken(fromToken, toToken)
  // } else {
  //   const dataFetcherStartTime = performance.now()
  //   await dataFetcher.fetchPoolsForToken(fromToken, toToken)
  //   const dataFetcherEndTime = performance.now()
  //   console.log(
  //     `dataFetcher.fetchPoolsForToken(fromToken, toToken) (${(dataFetcherEndTime - dataFetcherStartTime).toFixed(
  //       0
  //     )} ms) `
  //   )
  // }
  const dataFetcherStartTime = performance.now()
  await dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const dataFetcherEndTime = performance.now()
  console.log(
    `dataFetcher.fetchPoolsForToken(fromToken, toToken) (${(dataFetcherEndTime - dataFetcherStartTime).toFixed(0)} ms) `
  )

  // console.log('ROUTE:')
  // for (const leg of bestRoute.legs) {
  //   const p = poolCodesMap.get(leg.poolAddress)
  //   if (p) {
  //     console.log(
  //       `${p.pool.address} ${p.pool.token0.symbol}/${p.pool.token1.symbol}, r0: ${p.pool.reserve0} r1: ${p.pool.reserve1}`
  //     )
  //   } else {
  //     console.log('pool not found')
  //   }
  // }

  const routeEndTime = performance.now()
  console.log(`findSpecialRoute(..) (${(routeEndTime - routeStartTime).toFixed(0)} ms) `)
  return {
    route: {
      status: bestRoute?.status,
      fromToken: bestRoute?.fromToken?.address === '' ? Native.onChain(chainId) : bestRoute?.fromToken,
      toToken: bestRoute?.toToken?.address === '' ? Native.onChain(chainId) : bestRoute?.toToken,
      primaryPrice: bestRoute?.primaryPrice,
      swapPrice: bestRoute?.swapPrice,
      amountIn: bestRoute?.amountIn,
      amountInBN: bestRoute?.amountInBN.toString(),
      amountOut: bestRoute?.amountOut,
      amountOutBN: bestRoute?.amountOutBN.toString(),
      priceImpact: bestRoute?.priceImpact,
      totalAmountOut: bestRoute?.totalAmountOut,
      totalAmountOutBN: bestRoute?.totalAmountOutBN.toString(),
      gasSpent: bestRoute?.gasSpent,
      legs: bestRoute?.legs,
    },
    args: to
      ? Router.routeProcessorParams(poolCodesMap, bestRoute, fromToken, toToken, to, routeProcessorAddress[chainId])
      : undefined,
  }
})

// Run the server!
const start = async () => {
  try {
    const databaseClient = await createClient()

    dataFetcherMap.set(
      ChainId.ARBITRUM_NOVA,
      new DataFetcher(
        ChainId.ARBITRUM_NOVA,
        createPublicClient({
          chain: arbitrumNova,
          transport: http(arbitrumNova.rpcUrls.default.http[0]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.AVALANCHE,
      new DataFetcher(
        ChainId.AVALANCHE,
        createPublicClient({
          chain: avalanche,
          transport: fallback([http(avalanche.rpcUrls.default.http[0]), http('https://rpc.ankr.com/avalanche')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA,
      new DataFetcher(
        ChainId.BOBA,
        createPublicClient({
          chain: boba,
          transport: fallback([http(boba.rpcUrls.default.http[0]), http('https://lightning-replica.boba.network')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA_AVAX,
      new DataFetcher(
        ChainId.BOBA_AVAX,
        createPublicClient({
          chain: bobaAvax,
          transport: fallback([http(bobaAvax.rpcUrls.default.http[0]), http('https://replica.avax.boba.network')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA_BNB,
      new DataFetcher(
        ChainId.BOBA_BNB,
        createPublicClient({
          chain: bobaBnb,
          transport: fallback([http(bobaBnb.rpcUrls.default.http[0]), http('https://replica.bnb.boba.network')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.BSC,
      new DataFetcher(
        ChainId.BSC,
        createPublicClient({
          chain: bsc,
          transport: fallback([
            http(bsc.rpcUrls.default.http[0]),
            http('https://lb.drpc.org/ogrpc?network=bsc&dkey=Ak765fp4zUm6uVwKu4annC8M80dnCZkR7pAEsm6XXi_w'),
            http('https://bsc-dataseed.binance.org'),
            http('https://bsc-dataseed1.binance.org'),
            http('https://bsc-dataseed2.binance.org'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.BTTC,
      new DataFetcher(
        ChainId.BTTC,
        createPublicClient({
          chain: bttc,
          transport: http(bttc.rpcUrls.default.http[0]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.ETHEREUM,
      new DataFetcher(
        ChainId.ETHEREUM,
        createPublicClient({
          chain: mainnet,
          transport: fallback([
            http(`${mainnet.rpcUrls.alchemy.http}/${process.env.ALCHEMY_ID}`),
            http('https://eth.llamarpc.com'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.POLYGON,
      new DataFetcher(
        ChainId.POLYGON,
        createPublicClient({
          chain: polygon,
          transport: fallback([
            http(polygon.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
            http('https://polygon.llamarpc.com'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.ARBITRUM,
      new DataFetcher(
        ChainId.ARBITRUM,
        createPublicClient({
          chain: arbitrum,
          transport: fallback([
            http(arbitrum.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
            // http(optimism.rpcUrls.default.http[0]),
            http('https://rpc.ankr.com/arbitrum'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.OPTIMISM,
      new DataFetcher(
        ChainId.OPTIMISM,
        createPublicClient({
          chain: optimism,
          transport: fallback([
            http(optimism.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
            // http(optimism.rpcUrls.default.http[0]),
            http('https://rpc.ankr.com/optimism'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.CELO,
      new DataFetcher(
        ChainId.CELO,
        createPublicClient({
          chain: celo,
          transport: http(celo.rpcUrls.default.http[0]),
        }) as PublicClient,
        databaseClient
      )
    )

    dataFetcherMap.set(
      ChainId.FANTOM,
      new DataFetcher(
        ChainId.FANTOM,
        createPublicClient({
          chain: fantom,
          transport: fallback([
            http(fantom.rpcUrls.default.http[0]),
            http('https://rpc.fantom.network'),
            http('https://rpc2.fantom.network'),
          ]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.FUSE,
      new DataFetcher(
        ChainId.FUSE,
        createPublicClient({
          chain: fuse,
          transport: http(fuse.rpcUrls.default.http[0]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.GNOSIS,
      new DataFetcher(
        ChainId.GNOSIS,
        createPublicClient({
          chain: gnosis,
          transport: fallback([http(gnosis.rpcUrls.default.http[0]), http('https://rpc.ankr.com/gnosis')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.KAVA,
      new DataFetcher(
        ChainId.KAVA,
        createPublicClient({
          chain: kava,
          transport: fallback([http(kava.rpcUrls.default.http[0]), http(kava.rpcUrls.default.http[1])]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.METIS,
      new DataFetcher(
        ChainId.METIS,
        createPublicClient({
          chain: metis,
          transport: http(metis.rpcUrls.default.http[0]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.MOONBEAM,
      new DataFetcher(
        ChainId.MOONBEAM,
        createPublicClient({
          chain: moonbeam,
          transport: fallback([http(moonbeam.rpcUrls.default.http[0]), http('https://rpc.ankr.com/moonbeam')]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.MOONRIVER,
      new DataFetcher(
        ChainId.MOONRIVER,
        createPublicClient({
          chain: moonriver,
          transport: http(moonriver.rpcUrls.default.http[0]),
        }),
        databaseClient
      )
    )
    dataFetcherMap.set(
      ChainId.HARMONY,
      new DataFetcher(
        ChainId.HARMONY,
        createPublicClient({
          chain: harmony,
          transport: fallback([http(harmony.rpcUrls.default.http[0]), http('https://rpc.ankr.com/harmony')]),
        }),
        databaseClient
      )
    )

    for (const dataFetcher of dataFetcherMap.values()) {
      dataFetcher.startDataFetching()
    }
    await server.listen({ host: process.env['HOST'], port: process.env['PORT'] })
  } catch (err) {
    server.log.error(err)
    for (const dataFetcher of dataFetcherMap.values()) {
      dataFetcher.stopDataFetching()
    }
    process.exit(1)
  }
}

start()
