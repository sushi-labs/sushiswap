import { ChainId } from '@sushiswap/chain'
import {
  DAI,
  FRAX,
  LUSD,
  MAI,
  MIM,
  Native,
  nativeCurrencyIds,
  SUSHI,
  Token,
  UNI,
  USDC,
  USDT,
  WBTC,
  WETH9,
  WNATIVE,
} from '@sushiswap/currency'
import { DataFetcher, Router } from '@sushiswap/router'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BigNumber, providers } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import { RequestInfo, RequestInit } from 'node-fetch'
import { z } from 'zod'

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init))

const CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY = {
  [ChainId.ETHEREUM]: {
    NATIVE: Native.onChain(ChainId.ETHEREUM),
    WNATIVE: WETH9[ChainId.ETHEREUM],
    ETH: Native.onChain(ChainId.ETHEREUM),
    WETH: WETH9[ChainId.ETHEREUM],
    WBTC: WBTC[ChainId.ETHEREUM],
    USDC: USDC[ChainId.ETHEREUM],
    USDT: USDT[ChainId.ETHEREUM],
    DAI: DAI[ChainId.ETHEREUM],
    FRAX: FRAX[ChainId.ETHEREUM],
    MIM: MIM[ChainId.ETHEREUM],
    SUSHI: SUSHI[ChainId.ETHEREUM],
    MAI: MAI[ChainId.ETHEREUM],
    UNI: UNI[ChainId.ETHEREUM],
    LUSD: LUSD[ChainId.ETHEREUM],
  },
  [ChainId.POLYGON]: {
    NATIVE: Native.onChain(ChainId.POLYGON),
    WNATIVE: WNATIVE[ChainId.POLYGON],
    MATIC: Native.onChain(ChainId.POLYGON),
    WMATIC: WNATIVE[ChainId.POLYGON],
    WETH: WETH9[ChainId.POLYGON],
    WBTC: WBTC[ChainId.POLYGON],
    USDC: USDC[ChainId.POLYGON],
    USDT: USDT[ChainId.POLYGON],
    DAI: DAI[ChainId.POLYGON],
    FRAX: FRAX[ChainId.POLYGON],
    MIM: MIM[ChainId.POLYGON],
    SUSHI: SUSHI[ChainId.POLYGON],
    MAI: MAI[ChainId.POLYGON],
    UNI: UNI[ChainId.POLYGON],
  },
} as const

type ShortCurrencyNameChainId = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

type ShortCurrencyName = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[ShortCurrencyNameChainId]

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
  // chainId: z.coerce
  //   .number()
  //   .int()
  //   .gte(0)
  //   .lte(2 ** 256),
  address: z.coerce.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.coerce.number().int().gte(0),
})

const handler = async (request: VercelRequest, response: VercelResponse) => {
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = schema.parse(request.query)

  // console.log({ chainId, fromTokenId, toTokenId, amount, gasPrice, to })

  const isShortNameSupported = chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

  const SHORT_CURRENCY_NAME_TO_CURRENCY = CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId]

  const fromTokenIdIsShortName = fromTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY
  const toTokenIdIsShortName = toTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY

  // Limited to predefined short names and tokens from our db for now
  const fromToken =
    isShortNameSupported && fromTokenIdIsShortName
      ? SHORT_CURRENCY_NAME_TO_CURRENCY[fromTokenId as ShortCurrencyName]
      : new Token({
          chainId,
          ...tokenSchema.parse(
            await (await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(fromTokenId)}`)).json()
          ),
        })

  // Limited to predefined short names and tokens from our db for now
  const toToken =
    isShortNameSupported && toTokenIdIsShortName
      ? SHORT_CURRENCY_NAME_TO_CURRENCY[toTokenId as ShortCurrencyName]
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
