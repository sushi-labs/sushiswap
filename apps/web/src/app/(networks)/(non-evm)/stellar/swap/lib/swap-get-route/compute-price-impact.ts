interface ComputePriceImpact {
  amountIn: bigint
  amountOut: bigint
  midPrice: number // Price without considering slippage
}

/**
 * Compute price impact percentage
 *
 * Price impact = (expected_output - actual_output) / expected_output * 100
 *
 * Where:
 * - expected_output = amountIn * midPrice (theoretical output at mid price)
 * - actual_output = amountOut (actual output after slippage)
 */
export function computePriceImpact({
  amountIn,
  amountOut,
  midPrice,
}: ComputePriceImpact): number {
  // Convert bigints to numbers for calculation
  // In production, consider using decimal libraries for precision
  const amountInNum = Number(amountIn)
  const amountOutNum = Number(amountOut)

  // Calculate expected output at mid price
  const quotedOutputAmount = amountInNum * midPrice

  // Price impact = ((quoted - actual) / quoted) * 100
  if (quotedOutputAmount === 0) {
    return 0
  }

  const priceImpact =
    ((quotedOutputAmount - amountOutNum) / quotedOutputAmount) * 100

  // Return absolute value (always positive)
  return Math.abs(priceImpact)
}
