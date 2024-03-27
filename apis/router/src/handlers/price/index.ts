import { Request, Response } from 'express'
import { CHAIN_ID, ROUTER_CONFIG } from '../../config.js'
import { extractorClient } from '../../index.js'
import { priceUpdateInterval, prices } from '../../prices.js'
import { Currency, allPricesSchema, singleAddressSchema } from './schema.js'

export const pricesHandler = (req: Request, res: Response) => {
  const { currency } = allPricesSchema.parse(req.params)
  res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
  if (ROUTER_CONFIG[CHAIN_ID]?.['experimantalPriceIncrementalMode'] === true)
    res.json(
      currency === Currency.USD ? extractorClient?.getPrices() ?? {} : {},
    )
  else res.json(prices[currency])
}

export const priceByAddressHandler = (req: Request, res: Response) => {
  const { currency, address } = singleAddressSchema.parse({
    ...req.query,
    ...req.params,
  })
  res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
  if (ROUTER_CONFIG[CHAIN_ID]?.['experimantalPriceIncrementalMode'] === true) {
    if (currency === Currency.USD) res.json(extractorClient?.getPrice(address))
    else res.json()
  } else {
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
