import 'dotenv/config'

import fastify from 'fastify'
import { BigNumber, providers } from 'ethers'

import { ChainId } from "@sushiswap/chain"
import { DataFetcher, Router } from "@sushiswap/router"
import { z } from 'zod'
import { currencyFromShortCurrencyName, isShortCurrencyName, isShortCurrencyNameSupported, Native, nativeCurrencyIds, Token } from '@sushiswap/currency'
import fetch from 'node-fetch'
import { getAddress } from 'ethers/lib/utils'
import cors from '@fastify/cors'

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

const tokenSchema = z.object({
  address: z.coerce.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.coerce.number().int().gte(0),
})

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

class Waiter {
  resolved = false

  async wait() {
    while (!this.resolved) {
      await delay(500)
    }
  }

  resolve() {
    this.resolved = true
  }
}

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

  const isShortNameSupported = isShortCurrencyNameSupported(chainId)
  const fromTokenIdIsShortName = isShortCurrencyName(chainId, fromTokenId)
  const toTokenIdIsShortName = isShortCurrencyName(chainId, toTokenId)

  // Limited to predefined short names and tokens from our db for now
  const fromToken =
    isShortNameSupported && fromTokenIdIsShortName
      ? currencyFromShortCurrencyName(chainId, fromTokenId)
      : new Token({
          chainId,
          ...tokenSchema.parse(
            await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(fromTokenId)}`)).json()
          ),
        })

  // Limited to predefined short names and tokens from our db for now
  const toToken =
    isShortNameSupported && toTokenIdIsShortName
      ? currencyFromShortCurrencyName(chainId, toTokenId)
      : new Token({
          chainId,
          ...tokenSchema.parse(
            await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(toTokenId)}`)).json()
          ),
        })


  dataFetcher.fetchPoolsForToken(fromToken, toToken)

  const waiter = new Waiter()
  const router = new Router(dataFetcher, fromToken, BigNumber.from(amount.toString()), toToken, gasPrice ?? 30e9)

  router.startRouting((p) => {
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    waiter.resolve()
  })

  await waiter.wait()

  router.stopRouting()

  const bestRoute = router.getBestRoute()

  return {
    getCurrentRouteHumanArray: router.getCurrentRouteHumanArray(),
    getCurrentRouteHumanString: router.getCurrentRouteHumanString(),
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
    },
    getCurrentRouteRPParams: to
      ? router.getCurrentRouteRPParams(to, getRouteProcessorAddressForChainId(chainId))
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
    await server.listen({ host: "0.0.0.0", port: process.env['PORT'] ? Number(process.env['PORT']) : 3000 })
  } catch (err) {
    server.log.error(err)
    dataFetcher.stopDataFetching()
    process.exit(1)
  }
}

start()