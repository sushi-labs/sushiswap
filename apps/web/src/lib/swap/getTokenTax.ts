import { SimulateContractErrorType } from '@wagmi/core'
import { Fraction, Percent } from 'sushi'
import { Amount, Type } from 'sushi/currency'
import { decodeErrorResult } from 'viem'

const MAX_TOKEN_TAX = new Percent(1_000, 10_000) // 10%

export const getTokenTax = ({
  error,
  expectedAmountOut,
}: {
  error: SimulateContractErrorType
  expectedAmountOut: Amount<Type>
}) => {
  let amountOut: bigint | undefined = undefined

  try {
    const decodedErrors = error.message.match(
      /Error: MinimalOutputBalanceViolation\(uint256 amountOut\)\s+\(\d+\)/g,
    )

    if (decodedErrors) {
      const parsedAmountOut = decodedErrors[0].match(/\(\d+\)/g)
      if (parsedAmountOut) {
        amountOut = BigInt(parsedAmountOut[0].slice(1, -1))
      }
    } else {
      const encodedErrors = error.message.match(/0x963b34a5[a-fA-F0-9]{64}/g)
      if (encodedErrors) {
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
          data: encodedErrors[0] as `0x${string}`,
        }).args[0]
      }
    }
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
