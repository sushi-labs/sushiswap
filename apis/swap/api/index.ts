import { ChainId } from '@sushiswap/chain'
import { DAI, FRAX, LUSD, MAI, MIM, Native, SUSHI, UNI, USDC, USDT, WBTC, WETH9, WNATIVE } from '@sushiswap/currency'
import { DataFetcher, Router } from '@sushiswap/router'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { BigNumber, providers } from 'ethers'
import { z } from 'zod'

const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  fromTokenId: z.coerce.string(),
  toTokenId: z.coerce.string(),
  gasPrice: z.coerce.number().int().gte(1),
  amount: z.coerce.bigint(),
  to: z.coerce.string(),
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

class BackCounter {
  start: number
  current: number

  constructor(start: number) {
    this.start = start
    this.current = start
  }

  async wait() {
    while (this.current > 0) {
      console.log(`Wait ${this.current} sec ...`)
      this.current--
      await delay(1000)
    }
  }

  reset(startdiff = 0) {
    this.start += startdiff
    if (this.start < 0) this.start = 0
    this.current = this.start
  }
}

const CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY = {
  [ChainId.ETHEREUM]: {
    NATIVE: Native.onChain(ChainId.ETHEREUM),
    WNATIVE: WETH9[ChainId.ETHEREUM],
    WETH: WETH9[ChainId.POLYGON],
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

const backCounter = new BackCounter(4)

const handler = async (request: VercelRequest, response: VercelResponse) => {
  console.log('query', request.query)
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = schema.parse(request.query)

  const SHORT_CURRENCY_NAME_TO_CURRENCY = CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId]

  const fromToken =
    chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY && fromTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY
      ? CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId][fromTokenId as ShortCurrencyName]
      : SUSHI[chainId as ShortCurrencyNameChainId]

  const toToken =
    chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY && toTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY
      ? CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId][toTokenId as ShortCurrencyName]
      : USDC[chainId as ShortCurrencyNameChainId]

  const dataFetcher = new DataFetcher(
    new providers.AlchemyProvider(getAlchemyNetowrkForChainId(chainId), process.env['ALCHEMY_API_KEY']),
    chainId
  )
  dataFetcher.startDataFetching()
  dataFetcher.fetchPoolsForToken(fromToken, toToken)
  const router = new Router(dataFetcher, fromToken, BigNumber.from(amount.toString()), toToken, gasPrice ?? 30e9)
  router.startRouting(() => {
    //console.log('Known Pools:', dataFetcher.poolCodes.reduce((a, b) => ))
    const printed = router.getCurrentRouteHumanString()
    console.log(printed)
    backCounter.reset(-1)
  })

  await backCounter.wait()
  router.stopRouting()
  dataFetcher.stopDataFetching()

  return response.status(200).json({
    getCurrentRouteHumanString: router.getCurrentRouteHumanString(),
    // TODO: Dummy addresses
    getCurrentRouteRPParams: router.getCurrentRouteRPParams(to, '0x0'),
    getBestRoute: router.getBestRoute(),
  })
}

export default handler
