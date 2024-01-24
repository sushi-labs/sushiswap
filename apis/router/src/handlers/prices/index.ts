import { RPool, RToken, calcTokenAddressPrices } from '@sushiswap/tines'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { STABLES, WNATIVE } from 'sushi/currency'
import { ExtractorClient } from '../../ExtractorClient'
import { CHAIN_ID } from '../../config'
import { Currency, allPricesSchema, singleAddressSchema } from './schema'

let client: ExtractorClient

const priceUpdateInterval = 30 // SECONDS
const logInterval = 30 * 60 * 1000 // 30 MINUTES in milliseconds
let lastLogTime = Date.now() // Initialize last log time, unix ms
const prices: Record<Currency, Record<string, number>> = {
  [Currency.USD]: {},
  [Currency.NATIVE]: {},
  [Currency.ETHEREUM]: {},
  [Currency.BITCOIN]: {},
}

setInterval(() => {
  const currentTime = Date.now()
  const elapsedSinceLastLog = currentTime - lastLogTime
  const shouldLog = elapsedSinceLastLog >= logInterval
  updatePrices(CHAIN_ID as ChainId, Currency.USD, shouldLog)
  // updatePrices(CHAIN_ID, Currency.NATIVE) // TODO: disabled for now, multiply by any other currency instead
}, priceUpdateInterval * 1_000)

export const pricesHandler = (_client: ExtractorClient) => {
  client = _client
  return async (req: Request, res: Response) => {
    const { currency } = allPricesSchema.parse(req.params)
    res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
    res.json(prices[currency])
  }
}

export const priceByAddressHandler = (_client: ExtractorClient) => {
  client = _client
  return async (req: Request, res: Response) => {
    const { currency, address } = singleAddressSchema.parse({
      ...req.query,
      ...req.params,
    })
    res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
    if (
      prices[currency] === undefined ||
      prices[currency][address] === undefined
    ) {
      res.json()
      return
    }
    res.json(prices[currency][address])
  }
}

function updatePrices(
  chainId: ChainId,
  currency: Currency,
  logging = false,
): void {
  try {
    const startTime = performance.now()
    const pools = client.getCurrentPoolCodes().map((pc) => pc.pool)
    prices[currency] = getPrices(chainId, currency, pools)
    if (logging) {
      console.log(
        `updatePrices(${currency}) took ${
          (performance.now() - startTime) / 1000
        } seconds. Pool count: ${pools.length}`,
      )
      lastLogTime = startTime
    }
  } catch (e) {
    console.error(e)
  }
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
    // Determine the price based on the number of available prices for the token
    if (tokenPrices.length === 0) {
      // Case 1: No prices available for the token
      price = 0
    } else if (tokenPrices.length === 1) {
      // Case 2: Only one price available for the token
      const single = tokenPrices[0]
      price = single
    } else if (tokenPrices.length === 2 && tokenPrices[0] && tokenPrices[1]) {
      // Case 3: Two prices available for the token, average them
      const price1 = tokenPrices[0]
      const price2 = tokenPrices[1]
      const average = (price1 + price2) / 2
      price = average
    } else {
      // Case 4: More than two prices available for the token, calculate the median
      const sortedPrices = tokenPrices.sort()
      const midIndex = Math.floor(sortedPrices.length / 2)
      const median1 = sortedPrices[midIndex - 1]
      const median2 = sortedPrices[midIndex]

      if (sortedPrices.length % 2 === 0 && median1 && median2) {
        // Case 4.1: Even number of prices, calculate the average of the two middle values
        const medianAverage = (median1 + median2) / 2
        price = medianAverage
      } else {
        // Case 4.2: Odd number of prices, take the middle value as the median
        const median = sortedPrices[midIndex]
        price = median
      }
    }

    // Assign the determined price to the bestPrices object for the current token
    if (price) {
      bestPrices[token] = price
    }
  }
  return bestPrices
}

const hasPrice = (input: number | undefined): input is number =>
  input !== undefined
