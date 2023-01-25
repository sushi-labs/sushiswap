import 'dotenv/config'
import './env'

import cors from '@fastify/cors'
import { ChainId } from '@sushiswap/chain'
import { Native, nativeCurrencyIds } from '@sushiswap/currency'
import { routeProcessorExports } from '@sushiswap/route-processor/exports'
import { DataFetcher, findSpecialRoute, Router } from '@sushiswap/router'
import { BigNumber, providers } from 'ethers'
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

export function getAlchemyNetowrkForChainId(chainId: ChainId) {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'homestead'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.POLYGON_TESTNET:
      return 'maticmum'
    case ChainId.ARBITRUM:
      return 'arbitrum'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.GÖRLI:
      return 'goerli'
    default:
      throw new Error(`Unsupported eth alchemy network for ${chainId}`)
  }
}

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
  const bestRoute = findSpecialRoute(
    dataFetcher,
    fromToken,
    BigNumber.from(amount.toString()),
    toToken,
    gasPrice ?? 30e9
  )
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
    dataFetcherMap.set(
      ChainId.ETHEREUM,
      new DataFetcher(
        new providers.AlchemyProvider(getAlchemyNetowrkForChainId(ChainId.ETHEREUM), process.env['ALCHEMY_API_KEY']),
        ChainId.ETHEREUM
      )
    )
    dataFetcherMap.set(
      ChainId.POLYGON,
      new DataFetcher(
        new providers.AlchemyProvider(getAlchemyNetowrkForChainId(ChainId.POLYGON), process.env['ALCHEMY_API_KEY']),
        ChainId.POLYGON
      )
    )
    dataFetcherMap.set(
      ChainId.ARBITRUM,
      new DataFetcher(
        new providers.AlchemyProvider(getAlchemyNetowrkForChainId(ChainId.ARBITRUM), process.env['ALCHEMY_API_KEY']),
        ChainId.ARBITRUM
      )
    )
    for (const dataFetcher of dataFetcherMap.values()) {
      dataFetcher.startDataFetching()
    }
    await server.listen({ host: process.env['HOST'], port: process.env['PORT'] })
  } catch (err) {
    server.log.error(err)
    for (const dataFetcher of dataFetcherMap.values()) {
      dataFetcher.startDataFetching()
    }
    process.exit(1)
  }
}

start()
