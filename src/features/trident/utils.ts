import { Currency, CurrencyAmount, Price } from '@sushiswap/core-sdk'

export const getPriceOfNewPool = (
  amounts: (CurrencyAmount<Currency> | undefined)[]
): Price<Currency, Currency> | undefined => {
  if (!amounts[0]?.greaterThan(0) || !amounts[1]?.greaterThan(0)) {
    return undefined
  }
  const value = amounts[1].divide(amounts[0])
  return new Price(amounts[0].currency, amounts[1].currency, value.denominator, value.numerator)
}
