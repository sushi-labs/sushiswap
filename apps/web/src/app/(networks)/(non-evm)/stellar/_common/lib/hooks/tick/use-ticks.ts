'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { contractAddresses } from '../../soroban'
import { getPoolLensContractClient } from '../../soroban/client'
import type { PoolInfo } from '../../types/pool.type'
import {
  type FeeTier,
  MAX_TICK_RANGE,
  TICK_SPACINGS,
  isFeeTier,
} from '../../utils/ticks'

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
 * Align tick to tick spacing
 */
const nearestUsableTick = (tick: number, tickSpacing: number): number => {
  return Math.round(tick / tickSpacing) * tickSpacing
}

/**
 * This currently returns mock data for testing the UI.
 *
 * This creates ticks that mirror what you'd see from real positions:
 * - Position 1: +/- 1% of current price (tight range around current tick)
 * - Position 2: prices 1.5x to 2x (wider range above current price)
 * - Some additional scattered liquidity
 *
 * Each position creates TWO ticks:
 * - Lower tick: +liquidityNet (liquidity enters the range)
 * - Upper tick: -liquidityNet (liquidity exits the range)
 */
async function fetchTicks(
  pool: PoolInfo,
  numSurroundingTicks: number,
): Promise<PopulatedTick[]> {
  const tickSpacing = isFeeTier(pool.fee)
    ? TICK_SPACINGS[pool.fee as FeeTier]
    : 60

  const currentTick = pool.tick
  const activeTick = nearestUsableTick(currentTick, tickSpacing)
  const activeIndex = activeTick / (256 * tickSpacing)

  const minIndex =
    activeIndex - Math.ceil(numSurroundingTicks / (256 * tickSpacing))
  const maxIndex =
    activeIndex + Math.floor(numSurroundingTicks / (256 * tickSpacing))

  const populatedTicks: PopulatedTick[] = []

  const poolLensContractClient = getPoolLensContractClient({
    contractId: contractAddresses.POOL_LENS,
  })

  const populatedTickAssembledTransaction =
    await poolLensContractClient.get_populated_ticks_in_range({
      pool: pool.address,
      start_word: minIndex,
      count: maxIndex - minIndex + 1,
    })

  if (populatedTickAssembledTransaction.result.truncated) {
    console.warn('Warning: fetched ticks were truncated')
  }

  for (const populatedTick of populatedTickAssembledTransaction.result.ticks) {
    populatedTicks.push({
      tickIdx: populatedTick.tick,
      liquidityNet: populatedTick.liquidity_net,
      liquidityGross: populatedTick.liquidity_gross,
    })
  }

  // Sort by tick index
  populatedTicks.sort((a, b) => a.tickIdx - b.tickIdx)

  return populatedTicks
}

/**
 * Hook to fetch tick data for a Stellar pool
 */
export function useTicks({
  pool,
  numSurroundingTicks = (MAX_TICK_RANGE.upper - MAX_TICK_RANGE.lower) / 2,
  enabled = true,
}: UseTicksProps) {
  return useQuery({
    queryKey: [
      'stellar',
      'pool',
      'ticks',
      pool?.address,
      pool?.tick,
      numSurroundingTicks,
    ],
    queryFn: async () => {
      if (!pool) {
        throw new Error('Pool is required')
      }

      return fetchTicks(pool, numSurroundingTicks)
    },
    enabled: Boolean(pool && enabled),
    staleTime: ms('30s'),
    refetchInterval: ms('60s'), // Less frequent refresh for mock data
  })
}
