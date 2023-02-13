import './env'

import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { ChainId } from '@sushiswap/chain'
import { Native, nativeCurrencyIds } from '@sushiswap/currency'
import routeProcessorExports from '@sushiswap/route-processor/exports'
import {
  // findSpecialRoute,
  DataFetcher,
  Router,
} from '@sushiswap/router'
import { BigNumber } from 'ethers'
import fastify from 'fastify'
import { performance } from 'perf_hooks'
import { z } from 'zod'

import { getToken } from './tokens'

const server = fastify({ logger: true })
server.register(cors)
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
    .default(ChainId.ETHEREUM),
  fromTokenId: z.string().default(nativeCurrencyIds[ChainId.ETHEREUM]),
  toTokenId: z.string().default('SUSHI'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.bigint(),
  to: z.optional(z.string()),
})

export function getRouteProcessorAddressForChainId(chainId: ChainId) {
  if (!(chainId in routeProcessorExports)) {
    throw new Error(`Unsupported route processor network for ${chainId}`)
  }

  return routeProcessorExports[chainId.toString() as keyof Omit<typeof routeProcessorExports, '31337'>][0].contracts
    .RouteProcessor.address
}

// Declare a route
server.get('/v0', async (request) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = querySchema.parse(request.query)
  // console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to })
  const tokenStartTime = performance.now()
  const [fromToken, toToken] = await Promise.all([getToken(chainId, fromTokenId), getToken(chainId, toTokenId)])
  const tokenEndTime = performance.now()
  console.log(`tokens (${(tokenEndTime - tokenStartTime).toFixed(0)} ms) `)

  const dataFetcher = dataFetcherMap.get(chainId)
  if (!dataFetcher) {
    throw new Error(`Unsupported chainId ${chainId}`)
  }
  const dataFetcherStartTime = performance.now()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const dataFetcherEndTime = performance.now()
  console.log(
    `dataFetcher.fetchPoolsForToken(fromToken, toToken) (${(dataFetcherEndTime - dataFetcherStartTime).toFixed(0)} ms) `
  )
  const routeStartTime = performance.now()
  const poolCodesMap = dataFetcher.getCurrentPoolCodeMap(fromToken, toToken)

  // const bestRoute = findSpecialRoute(
  //   poolCodesMap,
  //   chainId,
  //   fromToken,
  //   BigNumber.from(amount.toString()),
  //   toToken,
  //   gasPrice ?? 30e9
  // )

  const bestRoute = Router.findBestRoute(
    poolCodesMap,
    chainId,
    fromToken,
    BigNumber.from(amount.toString()),
    toToken,
    gasPrice ?? 30e9
  )

  console.log('ROUTE WITH RESERVES:')
  for (const leg of bestRoute.legs) {
    const p = poolCodesMap.get(leg.poolAddress)
    if (p) {
      console.log(
        `${p.pool.address} ${p.pool.token0.symbol}/${p.pool.token1.symbol}, r0: ${p.pool.reserve0} r1: ${p.pool.reserve1}`
      )
    } else {
      console.log('pool not found')
    }
  }

  const routeEndTime = performance.now()
  console.log(`findSpecialRoute(..) (${(routeEndTime - routeStartTime).toFixed(0)} ms) `)
  return {
    getCurrentRouteHumanString: Router.routeToHumanString(poolCodesMap, bestRoute, fromToken, toToken),
    getBestRoute: {
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
    // getRouteAsArray: Router.routeToArray(dataFetcher, bestRoute),
    getCurrentRouteRPParams: to
      ? Router.routeProcessorParams(
          poolCodesMap,
          bestRoute,
          fromToken,
          toToken,
          to,
          getRouteProcessorAddressForChainId(chainId)
        )
      : undefined,
  }
})

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
import { createClient, http } from 'viem'
// import { arbitrum, bsc, celo, mainnet, optimism, polygon } from 'viem/chains'

// Run the server!
const start = async () => {
  try {
    dataFetcherMap.set(
      ChainId.ARBITRUM_NOVA,
      new DataFetcher(
        ChainId.ARBITRUM_NOVA,
        createClient({
          chain: arbitrumNova,
          transport: http(arbitrumNova.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.AVALANCHE,
      new DataFetcher(
        ChainId.AVALANCHE,
        createClient({
          chain: avalanche,
          transport: http(avalanche.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA,
      new DataFetcher(
        ChainId.BOBA,
        createClient({
          chain: boba,
          transport: http(boba.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA_AVAX,
      new DataFetcher(
        ChainId.BOBA_AVAX,
        createClient({
          chain: bobaAvax,
          transport: http(bobaAvax.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.BOBA_BNB,
      new DataFetcher(
        ChainId.BOBA_BNB,
        createClient({
          chain: bobaBnb,
          transport: http(bobaBnb.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.BSC,
      new DataFetcher(
        ChainId.BSC,
        createClient({
          chain: bsc,
          transport: http(bsc.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.BTTC,
      new DataFetcher(
        ChainId.BTTC,
        createClient({
          chain: bttc,
          transport: http(bttc.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.ETHEREUM,
      new DataFetcher(
        ChainId.ETHEREUM,
        createClient({
          chain: mainnet,
          transport: http(mainnet.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.POLYGON,
      new DataFetcher(
        ChainId.POLYGON,
        createClient({
          chain: polygon,
          transport: http(polygon.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.ARBITRUM,
      new DataFetcher(
        ChainId.ARBITRUM,
        createClient({
          chain: arbitrum,
          transport: http(arbitrum.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.OPTIMISM,
      new DataFetcher(
        ChainId.OPTIMISM,
        createClient({
          chain: optimism,
          transport: http(optimism.rpcUrls.alchemy.http + '/' + process.env.ALCHEMY_ID),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.CELO,
      new DataFetcher(
        ChainId.CELO,
        createClient({
          chain: celo,
          transport: http(celo.rpcUrls.default.http[0]),
        })
      )
    )

    dataFetcherMap.set(
      ChainId.FANTOM,
      new DataFetcher(
        ChainId.FANTOM,
        createClient({
          chain: fantom,
          transport: http(fantom.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.FUSE,
      new DataFetcher(
        ChainId.FUSE,
        createClient({
          chain: fuse,
          transport: http(fuse.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.GNOSIS,
      new DataFetcher(
        ChainId.GNOSIS,
        createClient({
          chain: gnosis,
          transport: http(gnosis.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.KAVA,
      new DataFetcher(
        ChainId.KAVA,
        createClient({
          chain: kava,
          transport: http(kava.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.METIS,
      new DataFetcher(
        ChainId.METIS,
        createClient({
          chain: metis,
          transport: http(metis.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.MOONBEAM,
      new DataFetcher(
        ChainId.MOONBEAM,
        createClient({
          chain: moonbeam,
          transport: http(moonbeam.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.MOONRIVER,
      new DataFetcher(
        ChainId.MOONRIVER,
        createClient({
          chain: moonriver,
          transport: http(moonriver.rpcUrls.default.http[0]),
        })
      )
    )
    dataFetcherMap.set(
      ChainId.HARMONY,
      new DataFetcher(
        ChainId.HARMONY,
        createClient({
          chain: harmony,
          transport: http(harmony.rpcUrls.default.http[0]),
        })
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
