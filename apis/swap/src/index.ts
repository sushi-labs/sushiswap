import 'dotenv/config'
import './env'

import cors from '@fastify/cors'
import { ChainId } from '@sushiswap/chain'
import { Native, nativeCurrencyIds } from '@sushiswap/currency'
import { DataFetcher, findSpecialRoute, Router } from '@sushiswap/router'
import { BigNumber, providers } from 'ethers'
import fastify from 'fastify'
import { z } from 'zod'

import { getToken } from './tokens'

const server = fastify({ logger: true })
server.register(cors)

let dataFetcher: DataFetcher

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
  switch (chainId) {
    case ChainId.ETHEREUM:
      return '0xf267704dD1393c26B39A6D41F49Bea233B34F722'
    case ChainId.POLYGON:
      return '0xf267704dD1393c26B39A6D41F49Bea233B34F722'
    default:
      throw new Error(`Unsupported route processor network for ${chainId}`)
  }
}

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

// Declare a route
server.get('/v0', async (request) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = querySchema.parse(request.query)

  // console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to })

  // Limited to predefined short names and tokens from our db for now
  const [fromToken, toToken] = await Promise.all([getToken(chainId, fromTokenId), getToken(chainId, toTokenId)])

  dataFetcher.fetchPoolsForToken(fromToken, toToken)

  // const router = new Router(dataFetcher, fromToken, BigNumber.from(amount.toString()), toToken, gasPrice ?? 30e9)
  // await new Promise<void>((resolve) => {
  //   router.startRouting(() => {
  //     resolve()
  //   })
  // })
  // router.stopRouting()

  // const bestRoute = router.getBestRoute()

  const bestRoute = findSpecialRoute(
    dataFetcher,
    fromToken,
    BigNumber.from(amount.toString()),
    toToken,
    gasPrice ?? 30e9
  )

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
    dataFetcher = new DataFetcher(
      new providers.AlchemyProvider(getAlchemyNetowrkForChainId(137), process.env['ALCHEMY_API_KEY']),
      137
    )
    dataFetcher.startDataFetching()
    await server.listen({ host: process.env['HOST'], port: process.env['PORT'] })
  } catch (err) {
    server.log.error(err)
    dataFetcher.stopDataFetching()
    process.exit(1)
  }
}

start()
