'use client'

import { Price, Token } from 'sushi/currency'
import { useMemo } from 'react'

export const usePriceInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
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
