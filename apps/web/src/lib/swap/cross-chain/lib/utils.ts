import { BigintIsh } from 'sushi/math'
import { getBigInt } from 'sushi/tines'

export const applySlippage = (
  amount: BigintIsh,
  slippagePercentage: string | number,
) => {
  return (
    (BigInt(amount) * getBigInt((1 - +slippagePercentage / 100) * 1_000_000)) /
    1_000_000n
  )
}
