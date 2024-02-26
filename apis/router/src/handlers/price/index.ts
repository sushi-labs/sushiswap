import { Request, Response } from 'express'
import { priceUpdateInterval, prices } from '../../prices.js'
import { allPricesSchema, singleAddressSchema } from './schema.js'

export const pricesHandler = (req: Request, res: Response) => {
  const { currency } = allPricesSchema.parse(req.params)
  res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
  res.json(prices[currency])
}

export const priceByAddressHandler = (req: Request, res: Response) => {
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
