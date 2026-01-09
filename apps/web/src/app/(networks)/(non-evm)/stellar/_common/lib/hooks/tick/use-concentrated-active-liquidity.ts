'use client'

import { useMemo } from 'react'
import { calculatePriceFromTick } from '../../soroban/pool-helpers'
import type { PoolInfo } from '../../types/pool.type'
import { TICK_SPACINGS, type FeeTier, isFeeTier } from '../../utils/ticks'
import { type PopulatedTick, useTicks } from './use-ticks'

const PRICE_FIXED_DIGITS = 8

export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
}

/**
 * Get the nearest usable tick for the pool
 */
const getActiveTick = (tickCurrent: number, tickSpacing: number): number => {
  return Math.floor(tickCurrent / tickSpacing) * tickSpacing
}

/**
 * Compute surrounding ticks with active liquidity
 * This mirrors the EVM implementation in src/lib/functions.ts
 */
function computeSurroundingTicks(
  activeTickProcessed: TickProcessed,
  sortedTickData: PopulatedTick[],
  pivot: number,
  ascending: boolean,
): TickProcessed[] {
  let previousTickProcessed: TickProcessed = {
    ...activeTickProcessed,
  }

  const processedTicks: TickProcessed[] = []

  for (
    let i = pivot + (ascending ? 1 : -1);
    ascending ? i < sortedTickData.length : i >= 0;
    ascending ? i++ : i--
  ) {
    const tick = sortedTickData[i].tickIdx
    const currentTickProcessed: TickProcessed = {
      liquidityActive: previousTickProcessed.liquidityActive,
      tick,
      liquidityNet: sortedTickData[i].liquidityNet,
      price0: calculatePriceFromTick(tick).toFixed(PRICE_FIXED_DIGITS),
    }

    // Update the active liquidity
    if (ascending) {
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive + sortedTickData[i].liquidityNet
    } else if (!ascending && previousTickProcessed.liquidityNet !== 0n) {
      currentTickProcessed.liquidityActive =
        previousTickProcessed.liquidityActive - previousTickProcessed.liquidityNet
    }

    processedTicks.push(currentTickProcessed)
    previousTickProcessed = currentTickProcessed
  }

  if (!ascending) {
    processedTicks.reverse()
  }

  return processedTicks
}

interface UseConcentratedActiveLiquidityProps {
  pool: PoolInfo | null | undefined
  enabled?: boolean
}

/**
 * Hook to get active liquidity data for the density chart
 * Processes raw tick data into chart-ready format
 */
export function useConcentratedActiveLiquidity({
  pool,
  enabled = true,
}: UseConcentratedActiveLiquidityProps) {
  const {
    data: ticks,
    isLoading: isTicksLoading,
    error,
  } = useTicks({
    pool,
    enabled,
  })

  return useMemo(() => {
    if (!pool || !ticks || ticks.length === 0 || isTicksLoading) {
      return {
        isLoading: isTicksLoading,
        error,
        activeTick: pool?.tick,
        data: undefined,
      }
    }

    const tickSpacing = isFeeTier(pool.fee)
      ? TICK_SPACINGS[pool.fee as FeeTier]
      : 60

    const activeTick = getActiveTick(pool.tick, tickSpacing)

    // Find where the active tick would be to partition the array
    const pivot = ticks.findIndex(({ tickIdx }) => tickIdx > activeTick) - 1

    if (pivot < 0) {
      // No ticks found around the active tick
      console.warn('TickData pivot not found')
      return {
        isLoading: false,
        error,
        activeTick,
        data: undefined,
      }
    }

    const poolLiquidity = BigInt(pool.liquidity.amount)

    const activeTickProcessed: TickProcessed = {
      liquidityActive: poolLiquidity,
      tick: activeTick,
      liquidityNet:
        ticks[pivot].tickIdx === activeTick ? ticks[pivot].liquidityNet : 0n,
      price0: calculatePriceFromTick(activeTick).toFixed(PRICE_FIXED_DIGITS),
    }

    const subsequentTicks = computeSurroundingTicks(
      activeTickProcessed,
      ticks,
      pivot,
      true,
    )
    const previousTicks = computeSurroundingTicks(
      activeTickProcessed,
      ticks,
      pivot,
      false,
    )

    const ticksProcessed = previousTicks
      .concat(activeTickProcessed)
      .concat(subsequentTicks)

    return {
      isLoading: false,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [pool, ticks, isTicksLoading, error])
}


