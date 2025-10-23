interface ComputeAmountWithFee {
  amountIn: bigint
  fee: number // Fee in basis points (e.g., 3000 = 0.3%)
}

/**
 * Compute amount after deducting swap fee
 * Uniswap V3 style: amountWithFee = amountIn * (1000000 - fee) / 1000000
 */
export function computeAmountWithFee({
  amountIn,
  fee,
}: ComputeAmountWithFee): bigint {
  const feeBasisPoints = BigInt(1000000 - fee)
  const denominator = BigInt(1000000)

  return (amountIn * feeBasisPoints) / denominator
}
