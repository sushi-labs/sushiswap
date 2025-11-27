import type { Token } from '../types/token.type'
import { ZERO_ADDRESS } from './constants'
import { getFees, getPool } from './dex-factory-helpers'
import type { PoolBasicInfo } from './pool-helpers'
import { getTokenByCode } from './token-helpers'

type DirectRoute = {
  type: 'direct'
  path: [Token, Token]
  pools: [PoolBasicInfo]
  fees: [number]
}

type MultiHopRoute = {
  type: 'multihop'
  path: [Token, Token, Token]
  pools: [PoolBasicInfo, PoolBasicInfo]
  fees: [number, number]
}

export type Route = DirectRoute | MultiHopRoute

// Find all pools between two tokens
export async function findPoolsBetweenTokens(
  tokenA: Token,
  tokenB: Token,
): Promise<PoolBasicInfo[]> {
  const pools: PoolBasicInfo[] = []

  // Dynamic pool discovery
  const fees = await getFees()

  for (const fee of fees) {
    try {
      const pool = await getPool({
        tokenA: tokenA.contract,
        tokenB: tokenB.contract,
        fee,
      })
      if (pool) {
        pools.push({
          address: pool,
          tokenA: tokenA,
          tokenB: tokenB,
          fee: fee,
        })
      }
    } catch (error) {
      // Pool doesn't exist for this fee tier
      console.warn(`Pool doesn't exist for fee tier ${fee}:`, error)
    }
  }
  return pools
}

// Find best path between tokens (direct or multi-hop)
export async function findBestPath(
  fromToken: Token,
  toToken: Token,
): Promise<Route | null> {
  const directPools = await findPoolsBetweenTokens(fromToken, toToken)

  if (directPools.length > 0) {
    // Use pool with lowest fee
    const bestPool = directPools.sort((a, b) => a.fee - b.fee)[0]
    return {
      type: 'direct',
      path: [fromToken, toToken],
      pools: [bestPool],
      fees: [bestPool.fee],
    }
  }

  // Step 2: Check multi-hop through XLM
  if (fromToken.code !== 'XLM' && toToken.code !== 'XLM') {
    const xlmToken = getTokenByCode('XLM')

    if (!xlmToken) return null

    const fromToXlm = await findPoolsBetweenTokens(fromToken, xlmToken)

    const xlmToTo = await findPoolsBetweenTokens(xlmToken, toToken)

    if (fromToXlm.length > 0 && xlmToTo.length > 0) {
      // Use pools with lowest fees
      const pool1 = fromToXlm.sort((a, b) => a.fee - b.fee)[0]
      const pool2 = xlmToTo.sort((a, b) => a.fee - b.fee)[0]

      return {
        type: 'multihop',
        path: [fromToken, xlmToken, toToken],
        pools: [pool1, pool2],
        fees: [pool1.fee, pool2.fee],
      }
    }
  }

  return null
}

/**
 * Calculate the minimum amount out for a given slippage tolerance
 * @param amountOut - Expected amount out
 * @param slippageTolerance - Slippage tolerance as a percentage (e.g., 0.5 for 0.5%)
 * @returns Minimum amount out
 */
export function calculateAmountOutMinimum(
  amountOut: bigint,
  slippageTolerance: number,
): bigint {
  const slippageBps = Math.floor(slippageTolerance * 100) // Convert to basis points
  const slippageMultiplier = BigInt(10000 - slippageBps)
  return (amountOut * slippageMultiplier) / BigInt(10000)
}

/**
 * Calculate the maximum amount in for a given slippage tolerance
 * @param amountIn - Expected amount in
 * @param slippageTolerance - Slippage tolerance as a percentage
 * @returns Maximum amount in
 */
export function calculateAmountInMaximum(
  amountIn: bigint,
  slippageTolerance: number,
): bigint {
  const slippageBps = Math.floor(slippageTolerance * 100)
  const slippageMultiplier = BigInt(10000 + slippageBps)
  return (amountIn * slippageMultiplier) / BigInt(10000)
}

/**
 * Calculate deadline timestamp
 * @param minutesFromNow - Minutes from current time
 * @returns Deadline timestamp
 */
export function calculateDeadline(minutesFromNow = 20): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + minutesFromNow * 60)
}
