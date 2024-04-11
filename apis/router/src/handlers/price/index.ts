import { Request, Response } from 'express'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
  STABLES,
} from 'sushi/config'
import { USDC, USDT } from 'sushi/currency'
import { RPool, RToken, getTokenPriceReasoning } from 'sushi/tines'
import { RequestStatistics } from '../../RequestStatistics.js'
import { CHAIN_ID, ROUTER_CONFIG } from '../../config.js'
import { extractorClient } from '../../index.js'
import { priceUpdateInterval, prices } from '../../prices.js'
import { Currency, allPricesSchema, singleAddressSchema } from './schema.js'

const priceStatistics = new RequestStatistics('Prices', 60_000) // update log once per min
priceStatistics.start()

export const pricesHandler = (req: Request, res: Response) => {
  const { currency, oldPrices } = allPricesSchema.parse({
    ...req.query,
    ...req.params,
  })
  res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
  if (
    ROUTER_CONFIG[CHAIN_ID]?.['experimantalPriceIncrementalMode'] === true &&
    oldPrices !== true
  ) {
    res.json(
      currency === Currency.USD ? extractorClient?.getPrices() ?? {} : {},
    )
  } else res.json(prices[currency])
  priceStatistics.addAllRequest()
}

export const priceByAddressHandler = (req: Request, res: Response) => {
  const { currency, address, oldPrices, reasoning } = singleAddressSchema.parse(
    {
      ...req.query,
      ...req.params,
    },
  )
  res.setHeader('Cache-Control', `maxage=${priceUpdateInterval}`)
  if (
    ROUTER_CONFIG[CHAIN_ID]?.['experimantalPriceIncrementalMode'] === true &&
    oldPrices !== true
  ) {
    if (reasoning) {
      res.send(
        makeHTMLReasoning(
          extractorClient?.getPriceReasoning(address) ?? ['Internal Error'],
        ),
      )
      return
    }
    if (currency === Currency.USD) {
      const price = extractorClient?.getPrice(address)
      if (price !== undefined) {
        res.json(price)
        priceStatistics.addKnownRequest()
      } else {
        res.json()
        priceStatistics.addUnKnownRequest()
      }
    } else res.json()
  } else {
    if (reasoning) {
      const baseTrusted = BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID] ?? []
      const additionalTrusted = Object.values(
        ADDITIONAL_BASES[CHAIN_ID] ?? [],
      ).flat()
      res.send(
        makeHTMLReasoning(
          getTokenPriceReasoning(
            extractorClient
              ?.getCurrentPoolCodes()
              .map((p) => p.pool) as RPool[],
            (USDT[CHAIN_ID as keyof typeof USDT] ??
              USDC[CHAIN_ID as keyof typeof USDC] ??
              STABLES[CHAIN_ID][0]) as RToken,
            address,
            1000,
            baseTrusted.concat(additionalTrusted) as RToken[],
          ),
        ),
      )
      return
    }
    if (
      prices[currency] === undefined ||
      prices[currency][address] === undefined
    ) {
      res.json()
      priceStatistics.addUnKnownRequest()
      return
    }
    res.json(prices[currency][address])
    priceStatistics.addKnownRequest()
  }
}

function makeHTMLReasoning(reasoning: string[]) {
  return `<html>
    <head/>
    <body>
      <font face="Courier">
      ${reasoning.map((r) => `<p>${r}</p>`).join('\n')}
      </font>
    </body>
</html`.replace(/[^ ]*\$/g, (s) => `<b>${s}</b>`)
}
