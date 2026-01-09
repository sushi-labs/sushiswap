'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { PoolInfo } from '../../types/pool.type'
import { TICK_SPACINGS, type FeeTier, isFeeTier } from '../../utils/ticks'

export interface PopulatedTick {
  tickIdx: number
  liquidityNet: bigint
  liquidityGross: bigint
}

interface UseTicksProps {
  pool: PoolInfo | null | undefined
  numSurroundingTicks?: number
  enabled?: boolean
}

/**
 * Calculate the bitmap index for a tick
 */
const bitmapIndex = (tick: number, tickSpacing: number) => {
  return Math.floor(tick / tickSpacing / 256)
}

/**
 * Align tick to tick spacing
 */
const nearestUsableTick = (tick: number, tickSpacing: number): number => {
  return Math.round(tick / tickSpacing) * tickSpacing
}

/**
 * TODO: Replace with actual contract call to pool-lens.get_populated_ticks_in_word
 * once the TickLens contract is deployed on Stellar.
 *
 * This currently returns mock data for testing the UI.
 *
 * The actual implementation should:
 * 1. Get the current tick from the pool
 * 2. Calculate bitmap indices for the surrounding range
 * 3. Call get_populated_ticks_in_word for each bitmap index
 * 4. Aggregate and sort the results
 *
 * Example of what the real implementation would look like:
 * ```ts
 * const poolLensClient = getPoolLensContractClient({
 *   contractId: contractAddresses.POOL_LENS,
 * })
 *
 * for (let i = minIndex; i <= maxIndex; i++) {
 *   const result = await poolLensClient.get_populated_ticks_in_word({
 *     pool: poolAddress,
 *     tick_bitmap_index: i,
 *   })
 *   ticks.push(...result.result)
 * }
 * ```
 */
async function fetchMockTicks(
  pool: PoolInfo,
  numSurroundingTicks: number,
): Promise<PopulatedTick[]> {
  const tickSpacing = isFeeTier(pool.fee)
    ? TICK_SPACINGS[pool.fee as FeeTier]
    : 60

  const currentTick = pool.tick
  const activeTick = nearestUsableTick(currentTick, tickSpacing)

  // Generate mock tick data around the current tick
  // This simulates what we'd get from the contract
  const mockTicks: PopulatedTick[] = []

  // Create a realistic distribution of liquidity
  // Concentrated around the current price with some spread
  const baseLiquidity = BigInt(pool.liquidity.amount) / 10n

  for (
    let i = activeTick - numSurroundingTicks * tickSpacing;
    i <= activeTick + numSurroundingTicks * tickSpacing;
    i += tickSpacing
  ) {
    // Skip some ticks randomly to simulate real-world sparse tick distribution
    if (Math.random() > 0.3) {
      // Distance from current tick affects liquidity distribution
      const distanceFromCurrent = Math.abs(i - activeTick)
      const maxDistance = numSurroundingTicks * tickSpacing

      // Gaussian-like distribution centered on current tick
      const normalizedDistance = distanceFromCurrent / maxDistance
      const liquidityMultiplier = Math.exp(-3 * normalizedDistance * normalizedDistance)

      // Add some randomness
      const randomFactor = 0.5 + Math.random()

      const liquidityNet =
        BigInt(Math.floor(Number(baseLiquidity) * liquidityMultiplier * randomFactor)) *
        (i < activeTick ? 1n : -1n)

      mockTicks.push({
        tickIdx: i,
        liquidityNet,
        liquidityGross: liquidityNet < 0n ? -liquidityNet : liquidityNet,
      })
    }
  }

  // Sort by tick index
  mockTicks.sort((a, b) => a.tickIdx - b.tickIdx)

  return mockTicks
}

/**
 * Hook to fetch tick data for a Stellar pool
 *
 * TODO: Replace mock implementation with actual contract calls
 * once TickLens is deployed
 */
export function useTicks({
  pool,
  numSurroundingTicks = 300,
  enabled = true,
}: UseTicksProps) {
  return useQuery({
    queryKey: [
      'stellar',
      'pool',
      'ticks',
      {
        poolAddress: pool?.address,
        tick: pool?.tick,
        numSurroundingTicks,
      },
    ],
    queryFn: async () => {
      if (!pool) {
        throw new Error('Pool is required')
      }

      // TODO: Replace with actual contract call
      return fetchMockTicks(pool, numSurroundingTicks)
    },
    enabled: Boolean(pool && enabled),
    staleTime: ms('30s'),
    refetchInterval: ms('30s'),
  })
}


