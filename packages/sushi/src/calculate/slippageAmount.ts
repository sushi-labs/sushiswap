import { Amount, Currency } from '../currency'
import { Fraction, Percent } from '../math'

const ONE = new Fraction(1, 1)

export function slippageAmount(
  value: Amount<Currency>,
  slippage: Percent,
): [bigint, bigint] {
  if (slippage.lessThan(0) || slippage.greaterThan(ONE))
    throw new Error('Unexpected slippage')
  return [
    value.multiply(ONE.subtract(slippage)).quotient,
    value.multiply(ONE.add(slippage)).quotient,
  ]
}
