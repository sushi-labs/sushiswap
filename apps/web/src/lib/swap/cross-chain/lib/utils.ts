import { BigintIsh, getBigInt } from 'sushi/math'

export const applySlippage = (
  amount: BigintIsh,
  slippagePercentage: string | number,
) => {
  return (
    (BigInt(amount) * getBigInt((1 - +slippagePercentage / 100) * 1_000_000)) /
    1_000_000n
  )
}
