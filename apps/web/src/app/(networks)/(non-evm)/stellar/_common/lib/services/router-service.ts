import type { StellarToken } from 'sushi/stellar'
import type { PoolBasicInfo } from '../soroban/pool-helpers'

/**
 * Swap route information
 */
export interface SwapRoute {
  path: StellarToken[]
  pools: PoolBasicInfo[]
  fees: number[]
  amountIn: bigint
  amountOut: bigint
  routeType: 'direct' | 'multihop'
}

/**
 * Format route for user display
 */
export function formatRouteForUser(route: SwapRoute): string {
  if (route.path.length === 2) {
    return `${route.path[0].symbol} → ${route.path[1].symbol}`
  } else {
    return route.path.map((t) => t.symbol).join(' → ')
  }
}

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
