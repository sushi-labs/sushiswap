'use client'

import { useMemo } from 'react'
import { calculatePriceFromTick } from '../../soroban/pool-helpers'
import type { PoolInfo } from '../../types/pool.type'
import {
  type FeeTier,
  TICK_SPACINGS,
  alignTick,
  isFeeTier,
} from '../../utils/ticks'
import { type PopulatedTick, useTicks } from './use-ticks'

const PRICE_FIXED_DIGITS = 8

export interface TickProcessed {
  tick: number
  liquidityActive: bigint
  liquidityNet: bigint
  price0: string
}

interface UseConcentratedActiveLiquidityProps {
  pool: PoolInfo | null | undefined
  enabled?: boolean
}

/**
 * Hook to get active liquidity data for the density chart.
 *
 * Processes raw tick data into chart-ready format by computing the
 * cumulative active liquidity at each tick position.
 *
 * The algorithm:
 * 1. Find where the current pool tick falls in the sorted tick array
 * 2. Starting from the pool's current liquidity, iterate outward
 * 3. Going up: add liquidityNet at each tick crossed
 * 4. Going down: subtract liquidityNet at each tick crossed
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

    // The active tick is the current tick rounded down to tick spacing
    const activeTick = alignTick(pool.tick, tickSpacing)
    const poolLiquidity = BigInt(pool.liquidity.amount)

    // Find the index of the first tick that is > activeTick
    // This tells us where to split the array
    const firstTickAboveActive = ticks.findIndex(
      ({ tickIdx }) => tickIdx > activeTick,
    )

    // Determine which ticks are below/at activeTick and which are above
    let ticksBelowOrAt: PopulatedTick[]
    let ticksAbove: PopulatedTick[]

    if (firstTickAboveActive === -1) {
      // All ticks are <= activeTick
      ticksBelowOrAt = ticks
      ticksAbove = []
    } else if (firstTickAboveActive === 0) {
      // All ticks are > activeTick
      ticksBelowOrAt = []
      ticksAbove = ticks
    } else {
      ticksBelowOrAt = ticks.slice(0, firstTickAboveActive)
      ticksAbove = ticks.slice(firstTickAboveActive)
    }

    const processedTicks: TickProcessed[] = []

    // Process ticks BELOW the active tick (going from activeTick downward)
    // We iterate in reverse order (from closest to activeTick to furthest)
    // and subtract liquidityNet as we cross each tick going down
    let currentLiquidity = poolLiquidity

    // Go through ticks below in reverse order (closest to active first)
    for (let i = ticksBelowOrAt.length - 1; i >= 0; i--) {
      const tick = ticksBelowOrAt[i]

      // When crossing a tick going DOWN, we subtract that tick's liquidityNet
      // But we do this AFTER recording the liquidity for this tick
      // because the liquidity shown at a tick is the liquidity IN the range
      // that starts at that tick

      // First, if this isn't the first tick we process, subtract the previous tick's net
      // Actually, the convention is: liquidityNet is added when crossing UP, subtracted when crossing DOWN
      // When we're at tick T going down to tick T-1, we subtract T's liquidityNet

      processedTicks.unshift({
        tick: tick.tickIdx,
        liquidityActive: currentLiquidity,
        liquidityNet: tick.liquidityNet,
        price0: calculatePriceFromTick(tick.tickIdx).toFixed(
          PRICE_FIXED_DIGITS,
        ),
      })

      // Subtract this tick's liquidityNet for the next iteration (going further down)
      currentLiquidity = currentLiquidity - tick.liquidityNet
    }

    // Process ticks ABOVE the active tick (going from activeTick upward)
    // We add liquidityNet as we cross each tick going up
    currentLiquidity = poolLiquidity

    for (const tick of ticksAbove) {
      // When crossing a tick going UP, we add that tick's liquidityNet
      currentLiquidity = currentLiquidity + tick.liquidityNet

      processedTicks.push({
        tick: tick.tickIdx,
        liquidityActive: currentLiquidity,
        liquidityNet: tick.liquidityNet,
        price0: calculatePriceFromTick(tick.tickIdx).toFixed(
          PRICE_FIXED_DIGITS,
        ),
      })
    }

    return {
      isLoading: false,
      error,
      activeTick,
      data: processedTicks,
    }
  }, [pool, ticks, isTicksLoading, error])
}
