'use client'

import { useMemo } from 'react'
import type { Currency, Price } from 'sushi'

export function usePriceInverter<TCurrency extends Currency>({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<TCurrency, TCurrency>
  priceUpper?: Price<TCurrency, TCurrency>
  quote?: TCurrency
  base?: TCurrency
  invert?: boolean
}): {
  priceLower?: Price<TCurrency, TCurrency>
  priceUpper?: Price<TCurrency, TCurrency>
  quote?: TCurrency
  base?: TCurrency
} {
  return useMemo(
    () => ({
      priceUpper: invert ? priceLower?.invert() : priceUpper,
      priceLower: invert ? priceUpper?.invert() : priceLower,
      quote: invert ? base : quote,
      base: invert ? quote : base,
    }),
    [base, invert, priceLower, priceUpper, quote],
  )
}
