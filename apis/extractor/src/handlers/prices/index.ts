import { RToken, calcTokenAddressPrices } from '@sushiswap/tines'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { STABLES } from 'sushi/currency'
import extractor from '../../extractor'
import schema from './schema'

function priceRecalcInterval(_chainId: ChainId) {
  return 10
}
const lastPriceUpdate: number[] = []
const lastPricesSerialized: Record<number, Record<string, number>> = {}

const handler = async (req: Request, res: Response) => {
  const { chainId } = schema.parse(req.query)
  const interval = priceRecalcInterval(chainId)
  res.setHeader('Cache-Control', `maxage=${interval}`)
  const lastUpdate = lastPriceUpdate[chainId]
  if (
    lastUpdate === undefined ||
    lastUpdate + interval < Date.now() / 1000 ||
    lastPricesSerialized[chainId] === undefined
  ) {
    const pools = extractor.getCurrentPoolCodes().map((pc) => pc.pool)
    const baseToken = STABLES[chainId][0] as RToken

    const prices = calcTokenAddressPrices(
      pools,
      baseToken,
      1000 * 10 ** baseToken.decimals,
    )
    const stablesPrices = STABLES[chainId]
      .map((t) => {
        const price = prices[t.address]
        if (price === undefined) return undefined
        return price < 1.05 && price > 0.95 ? price : undefined
      })
      .filter((p) => p !== undefined) as number[]
    const usdPriceSupposed =
      stablesPrices.reduce((a, b) => a + b, 0) / stablesPrices.length
    Object.keys(prices).forEach((addr) => {
      prices[addr] /= usdPriceSupposed
    })
    lastPricesSerialized[chainId] = prices
  }
  res.json(lastPricesSerialized[chainId])
}

export default handler
