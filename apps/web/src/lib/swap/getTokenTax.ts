import { type Amount, Fraction, Percent } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { type Hex, decodeErrorResult } from 'viem'

const MAX_TOKEN_TAX = new Percent({ numerator: 1_000, denominator: 10_000 }) // 10%

export const getTokenTax = ({
  data,
  expectedAmountOut,
}: {
  data: Hex
  expectedAmountOut: Amount<EvmCurrency>
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
    const amountReceivedFraction = new Fraction({
      numerator: amountOut,
      denominator: expectedAmountOut.amount,
    })
    const amountReceivedPercent = new Percent({
      numerator: Math.ceil(
        Math.round(+amountReceivedFraction.toString({ fixed: 3 }) * 10_000),
      ),
      denominator: 10_000,
    })
    const tax = new Percent(1).sub(amountReceivedPercent)
    if (tax.lte(MAX_TOKEN_TAX)) {
      return tax
    }
  }

  return false
}
