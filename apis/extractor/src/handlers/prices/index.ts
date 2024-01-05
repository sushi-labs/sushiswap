import { RPool, RToken, calcTokenAddressPrices } from '@sushiswap/tines'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { STABLES, WNATIVE } from 'sushi/currency'
import { CHAIN_ID } from '../../config'
import extractor from '../../extractor'
import { Currency, allPricesSchema, singleAddressSchema } from './schema'

const updateInterval = 30 // SECONDS
const prices: Record<Currency, Record<string, number>> = {
  [Currency.USD]: {},
  [Currency.NATIVE]: {},
  [Currency.ETHEREUM]: {},
  [Currency.BITCOIN]: {},
}

setInterval(() => {
  updatePrices(CHAIN_ID, Currency.USD)
  updatePrices(CHAIN_ID, Currency.NATIVE)
}, updateInterval * 1_000)

export const pricesHandler = async (req: Request, res: Response) => {
  const { currency } = allPricesSchema.parse(req.params)
  res.setHeader('Cache-Control', `maxage=${updateInterval}`)
  res.json(prices[currency])
}

export const priceByAddressHandler = async (req: Request, res: Response) => {
  const { currency, address } = singleAddressSchema.parse({
    ...req.query,
    ...req.params,
  })
  res.setHeader('Cache-Control', `maxage=${updateInterval}`)
  if (prices[currency] === undefined) {
    res.json({})
    return
  }
  res.json(prices[currency][address] ?? {})
}

function updatePrices(chainId: ChainId, currency: Currency): void {
  const pools = extractor.getCurrentPoolCodes().map((pc) => pc.pool)
  prices[currency] = getPrices(chainId, currency, pools)
}

function getPrices(chainId: number, currency: Currency, pools: RPool[]) {
  if (
    currency === Currency.USD &&
    STABLES[chainId as keyof typeof STABLES] === undefined
  ) {
    throw new Error(`ChainId ${chainId} has no stables configured`)
  }

  const bases =
    currency === Currency.USD
      ? (STABLES[chainId as keyof typeof STABLES] as unknown as RToken[])
      : ([WNATIVE[chainId as keyof typeof WNATIVE]] as unknown as RToken[])

  const prices = calculateTokenPrices(bases, pools, 1000)

  return prices
}

function calculateTokenPrices(
  bases: RToken[],
  pools: RPool[],
  minimumLiquidityUsd: number,
) {
  const prices: Map<string, Map<string, number>> = new Map()
  const allTokens: Set<string> = new Set()
  const bestPrices: Record<string, number> = {}

  bases.forEach((base) => {
    const currentPrices = calcTokenAddressPrices(
      pools,
      base,
      minimumLiquidityUsd,
      // true,
    )
    const currentPricesMap = new Map<string, number>()
    Object.entries(currentPrices).forEach(([address, price]) => {
      currentPricesMap.set(address, price)
      allTokens.add(address)
    })
    prices.set(base.address, currentPricesMap)
  })

  for (const token of allTokens) {
    const tokenPrices = Array.from(prices.keys())
      .map((t) => prices.get(t))
      .map((t) => t?.get(token))
      .filter(hasPrice)
    let price
    if (tokenPrices.length === 0) {
      price = 0
    } else if (tokenPrices.length === 1) {
      const single = tokenPrices[0]
      price = single
    } else if (tokenPrices.length === 2 && tokenPrices[0] && tokenPrices[1]) {
      const price1 = tokenPrices[0]
      const price2 = tokenPrices[1]
      const average = (price1 + price2) / 2
      price = average
    } else {
      const sortedPrices = tokenPrices.sort()
      const midIndex = Math.floor(sortedPrices.length / 2)
      const median1 = sortedPrices[midIndex - 1]
      const median2 = sortedPrices[midIndex]
      if (sortedPrices.length % 2 === 0 && median1 && median2) {
        const medianAverage = (median1 + median2) / 2
        price = medianAverage
      } else {
        const median = sortedPrices[midIndex]
        price = median
      }
    }
    if (price) {
      bestPrices[token] = price
    }
  }
  return bestPrices
}

const hasPrice = (input: number | undefined): input is number =>
  input !== undefined
