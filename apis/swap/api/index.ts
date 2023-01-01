import { ChainId } from '@sushiswap/chain'
import {
  isShortName,
  isShortNameToCurrencySupported,
  nativeCurrencyIds,
  ShortName,
  shortNameToCurrency,
  Token,
} from '@sushiswap/currency'
import { DataFetcher, Router } from '@sushiswap/router'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BigNumber, providers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { RequestInfo, RequestInit } from 'node-fetch'
import { z } from 'zod'

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init))

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM),
  fromTokenId: z.string().default(nativeCurrencyIds[ChainId.ETHEREUM]),
  toTokenId: z.string().default('SUSHI'),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.bigint({
    invalid_type_error: 'amount must be a string',
    required_error: 'amount is required',
    description: 'amount',
  }),
  to: z.string(),
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

const tokenSchema = z.object({
  address: z.coerce.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.coerce.number().int().gte(0),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = schema.parse(request.query)

  // console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to })

  const isShortNameSupported = isShortNameToCurrencySupported(chainId)
  const fromTokenIdIsShortName = isShortName(chainId, fromTokenId)
  const toTokenIdIsShortName = isShortName(chainId, toTokenId)

  // Limited to predefined short names and tokens from our db for now
  const fromToken =
    isShortNameSupported && fromTokenIdIsShortName
      ? shortNameToCurrency(chainId, fromTokenId as ShortName)
      : new Token({
          chainId,
          ...tokenSchema.parse(
            await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(fromTokenId)}`)).json()
          ),
        })

  // Limited to predefined short names and tokens from our db for now
  const toToken =
    isShortNameSupported && toTokenIdIsShortName
      ? shortNameToCurrency(chainId, toTokenId as ShortName)
      : new Token({
          chainId,
          ...tokenSchema.parse(
            await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(toTokenId)}`)).json()
          ),
        })

  const dataFetcher = new DataFetcher(
    new providers.AlchemyProvider(getAlchemyNetowrkForChainId(chainId), process.env['ALCHEMY_API_KEY']),
    chainId
  )
  dataFetcher.startDataFetching()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const waiter = new Waiter()
  const router = new Router(dataFetcher, fromToken, BigNumber.from(amount.toString()), toToken, gasPrice ?? 30e9)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    waiter.resolve()
  })

  await waiter.wait()
  router.stopRouting()
  dataFetcher.stopDataFetching()

  const bestRoute = router.getBestRoute()

  return response.status(200).json({
    getCurrentRouteHumanArray: router.getCurrentRouteHumanArray(),
    getCurrentRouteHumanString: router.getCurrentRouteHumanString(),
    getBestRoute: {
      status: bestRoute?.status,
      fromToken: bestRoute?.fromToken,
      toToken: bestRoute?.toToken,
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
    getCurrentRouteRPParams: router.getCurrentRouteRPParams(to, '0x0000000000000000000000000000000000000000'),
  })
}

export default handler
