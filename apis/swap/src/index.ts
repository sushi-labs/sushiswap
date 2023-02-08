import './env'

import cors from '@fastify/cors'
import { ChainId } from '@sushiswap/chain'
import { Native, nativeCurrencyIds } from '@sushiswap/currency'
import routeProcessorExports from '@sushiswap/route-processor/exports'
import {
  // findSpecialRoute,
  Router,
} from '@sushiswap/router'
import { DataFetcher } from '@sushiswap/router/dist/DataFetcher'
import { BigNumber } from 'ethers'
import fastify from 'fastify'
import { performance } from 'perf_hooks'
import { z } from 'zod'

import { getToken } from './tokens'

const server = fastify({ logger: true })
server.register(cors)

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
  // const bestRoute = findSpecialRoute(
  //   dataFetcher,
  //   fromToken,
  //   BigNumber.from(amount.toString()),
  //   toToken,
  //   gasPrice ?? 30e9
  // )

  // const poolCodesMap = dataFetcher.getCurrentPoolCodeMap()

  const bestRoute = Router.findBestRoute(
    dataFetcher,
    fromToken,
    BigNumber.from(amount.toString()),
    toToken,
    gasPrice ?? 30e9
  )

  const pools = dataFetcher.getCurrentPoolCodeMap()

  console.log('ROUTE WITH RESERVES:')
  for (const leg of bestRoute.legs) {
    const p = pools.get(leg.poolAddress)
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
    getCurrentRouteHumanString: Router.routeToHumanString(dataFetcher, bestRoute, fromToken, toToken),
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
          dataFetcher,
          bestRoute,
          fromToken,
          toToken,
          to,
          getRouteProcessorAddressForChainId(chainId)
        )
      : undefined,
  }
})

// Run the server!
const start = async () => {
  try {
    dataFetcherMap.set(ChainId.ARBITRUM, new DataFetcher(ChainId.ARBITRUM))
    dataFetcherMap.set(ChainId.ARBITRUM_NOVA, new DataFetcher(ChainId.ARBITRUM_NOVA))
    dataFetcherMap.set(ChainId.AVALANCHE, new DataFetcher(ChainId.AVALANCHE))
    dataFetcherMap.set(ChainId.BOBA, new DataFetcher(ChainId.BOBA))
    dataFetcherMap.set(ChainId.BOBA_AVAX, new DataFetcher(ChainId.BOBA_AVAX))
    dataFetcherMap.set(ChainId.BOBA_BNB, new DataFetcher(ChainId.BOBA_BNB))
    dataFetcherMap.set(ChainId.BSC, new DataFetcher(ChainId.BSC))
    dataFetcherMap.set(ChainId.BTTC, new DataFetcher(ChainId.BTTC))
    dataFetcherMap.set(ChainId.CELO, new DataFetcher(ChainId.CELO))
    dataFetcherMap.set(ChainId.ETHEREUM, new DataFetcher(ChainId.ETHEREUM))
    dataFetcherMap.set(ChainId.FANTOM, new DataFetcher(ChainId.FANTOM))
    dataFetcherMap.set(ChainId.FUSE, new DataFetcher(ChainId.FUSE))
    dataFetcherMap.set(ChainId.GNOSIS, new DataFetcher(ChainId.GNOSIS))
    dataFetcherMap.set(ChainId.KAVA, new DataFetcher(ChainId.KAVA))
    dataFetcherMap.set(ChainId.METIS, new DataFetcher(ChainId.METIS))
    dataFetcherMap.set(ChainId.MOONBEAM, new DataFetcher(ChainId.MOONBEAM))
    dataFetcherMap.set(ChainId.MOONRIVER, new DataFetcher(ChainId.MOONRIVER))
    dataFetcherMap.set(ChainId.OPTIMISM, new DataFetcher(ChainId.OPTIMISM))
    dataFetcherMap.set(ChainId.POLYGON, new DataFetcher(ChainId.POLYGON))
    dataFetcherMap.set(ChainId.HARMONY, new DataFetcher(ChainId.HARMONY))

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
