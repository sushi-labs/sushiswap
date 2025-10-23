import { computeAmountWithFee } from './compute-amount-with-fee'

interface ComputeExactOutput {
  amountIn: bigint
  reserve0: bigint
  reserve1: bigint
  fee: number
}

/**
 * Compute exact output for a Uniswap V3 concentrated liquidity swap
 * This is a simplified version that assumes uniform liquidity across the price range
 *
 * Formula: amountOut = (amountWithFee * reserve1) / (reserve0 + amountWithFee)
 *
 * Note: This is an approximation. The actual V3 math involves:
 * - Iterating through ticks
 * - Handling multiple liquidity ranges
 * - More complex sqrt price calculations
 *
 * For routing purposes, this approximation is sufficient to compare routes
 */
export function computeExactOutput({
  amountIn,
  reserve0,
  reserve1,
  fee,
}: ComputeExactOutput): bigint {
  // Apply fee to input amount
  const amountWithFee = computeAmountWithFee({ amountIn, fee })

  // Calculate output using constant product formula (x * y = k)
  // amountOut = (amountWithFee * reserve1) / (reserve0 + amountWithFee)
  const numerator = amountWithFee * reserve1
  const denominator = reserve0 + amountWithFee

  if (denominator === 0n) {
    return 0n
  }

  return numerator / denominator
}
