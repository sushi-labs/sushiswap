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
  alignTick,
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

async function fetchTicks(
  pool: PoolInfo,
  numSurroundingTicks: number,
): Promise<PopulatedTick[]> {
  const tickSpacing = isFeeTier(pool.fee)
    ? TICK_SPACINGS[pool.fee as FeeTier]
    : 60

  const currentTick = pool.tick
  const activeTick = alignTick(currentTick, tickSpacing)
  const activeIndex = Math.floor(activeTick / (256 * tickSpacing))

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
      try {
      if (!pool) {
        throw new Error('Pool is required')
      }

        return await fetchTicks(pool, numSurroundingTicks)
      } catch (error) {
        console.error('Error fetching ticks:', error)
        throw error
      }
    },
    enabled: Boolean(pool && enabled),
    staleTime: ms('30s'),
    refetchInterval: ms('60s'),
  })
}
