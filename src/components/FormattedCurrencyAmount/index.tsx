import { Currency, CurrencyAmount, Fraction, JSBI } from '@sushiswap/core-sdk'
import React from 'react'

const CURRENCY_AMOUNT_MIN = new Fraction(JSBI.BigInt(1), JSBI.BigInt(1000000))

export default function FormattedCurrencyAmount({
  currencyAmount,
  significantDigits = 4,
}: {
  currencyAmount: CurrencyAmount<Currency>
  significantDigits?: number
}) {
  return (
    <>
      {currencyAmount.equalTo(JSBI.BigInt(0))
        ? '0'
        : currencyAmount.greaterThan(CURRENCY_AMOUNT_MIN)
        ? currencyAmount.toSignificant(significantDigits)
        : `<${CURRENCY_AMOUNT_MIN.toSignificant(1)}`}
    </>
  )
}
