import { Fraction, Percent } from 'sushi'
import type { Amount, Type } from 'sushi/currency'
import { type Hex, decodeErrorResult } from 'viem'

const MAX_TOKEN_TAX = new Percent(1_000, 10_000) // 10%

export const getTokenTax = ({
  data,
  expectedAmountOut,
}: {
  data: Hex
  expectedAmountOut: Amount<Type>
}) => {
  let amountOut: bigint | undefined = undefined

  try {
    amountOut = decodeErrorResult({
      abi: [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'amountOut',
              type: 'uint256',
            },
          ],
          name: 'MinimalOutputBalanceViolation',
          type: 'error',
        },
      ],
      data,
    }).args[0]
  } catch (_) {}

  if (amountOut) {
    const amountReceivedFraction = new Fraction(
      amountOut,
      expectedAmountOut.quotient,
    )
    const amountReceivedPercent = new Percent(
      Math.ceil(Math.round(+amountReceivedFraction.toFixed(3) * 10_000)),
      10_000,
    )
    const tax = new Percent(1).subtract(amountReceivedPercent)
    if (tax.lessThan(MAX_TOKEN_TAX) || tax.equalTo(MAX_TOKEN_TAX)) {
      return tax
    }
  }

  return false
}
