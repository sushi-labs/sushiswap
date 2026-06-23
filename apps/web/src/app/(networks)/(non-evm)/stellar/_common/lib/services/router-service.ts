/**
 * Calculate minimum amount out with slippage protection
 */
export function calculateAmountOutMinimum(
  amountOut: bigint,
  slippage = 0.005,
): bigint {
  if (!Number.isFinite(slippage)) {
    throw new Error(`Invalid slippage: ${slippage}`)
  }
  const clampedSlippage = Math.min(1, Math.max(0, slippage))
  const slippageMultiplier = BigInt(Math.floor((1 - clampedSlippage) * 1000000))
  return (amountOut * slippageMultiplier) / BigInt(1000000)
}
