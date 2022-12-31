import { ChainId } from '@sushiswap/chain'
import { DAI, FRAX, LUSD, MAI, MIM, Native, SUSHI, UNI, USDC, USDT, WBTC, WNATIVE } from '@sushiswap/currency'
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
    ETH: Native.onChain(ChainId.ETHEREUM),
    WNATIVE: WNATIVE[ChainId.ETHEREUM],
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
} as const

type ShortCurrencyNameChainId = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY

type ShortCurrencyName = keyof typeof CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[ShortCurrencyNameChainId]

const handler = async (request: VercelRequest, response: VercelResponse) => {
  console.log('query', request.query)
  const { chainId, fromTokenId, toTokenId, amount, gasPrice, to } = schema.parse(request.query)

  const SHORT_CURRENCY_NAME_TO_CURRENCY = CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId]

  const fromToken =
    chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY && fromTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY
      ? CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId][fromTokenId as ShortCurrencyName]
      : SUSHI[ChainId.ETHEREUM]

  const toToken =
    chainId in CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY && toTokenId in SHORT_CURRENCY_NAME_TO_CURRENCY
      ? CHAIN_ID_SHORT_CURRENCY_NAME_TO_CURRENCY[chainId as ShortCurrencyNameChainId][toTokenId as ShortCurrencyName]
      : USDC[ChainId.ETHEREUM]

  const backCounter = new BackCounter(4)

  const dataFetcher = new DataFetcher(
    new providers.AlchemyProvider('homestead', process.env['ALCHEMY_API_KEY']),
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
