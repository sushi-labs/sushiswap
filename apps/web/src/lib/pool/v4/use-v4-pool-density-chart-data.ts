'use client'

import { useMemo } from 'react'
import { processActiveLiquidity } from 'src/lib/pool/cl'
import {
  type EvmCurrency,
  type SushiSwapV4ChainId,
  sushiSwapV4TickToPrice,
} from 'sushi/evm'
import type { Hex } from 'viem'
import { getDensityChartData } from '~evm/[chainId]/_ui/liquidity-chart-range-input/hooks'
import { useV4PoolSlot0, useV4PoolTicks } from './use-v4-pool-state'

interface UseV4PoolDensityChartDataParams {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  token0: EvmCurrency
  token1: EvmCurrency
}

interface V4PoolDensityChartData {
  series: ReturnType<typeof getDensityChartData> | undefined
  currentPrice: number | null
  isLoading: boolean
  error: Error | null
  /** Whether the pool loaded with no initialized ticks, so no liquidity. */
  isEmpty: boolean
}

/** Liquidity density around the current price, plus the current price itself. */
export function useV4PoolDensityChartData({
  chainId,
  poolId,
  token0,
  token1,
}: UseV4PoolDensityChartDataParams): V4PoolDensityChartData {
  const slot0 = useV4PoolSlot0({ chainId, poolId })
  const ticks = useV4PoolTicks({
    chainId,
    poolId,
    tickSpacing: slot0.data?.tickSpacing,
  })

  const series = useMemo(() => {
    if (!slot0.data || !ticks.data?.length) return undefined

    const { tick, tickSpacing, liquidity } = slot0.data
    const processed = processActiveLiquidity({
      token0,
      token1,
      activeTick: Math.floor(tick / tickSpacing) * tickSpacing,
      liquidity,
      ticks: ticks.data.map(({ tick, liquidityNet }) => ({
        tickIdx: tick,
        liquidityNet,
      })),
    })

    return processed ? getDensityChartData(processed) : undefined
  }, [slot0.data, ticks.data, token0, token1])

  const currentPrice = useMemo(() => {
    if (!slot0.data) return null

    return Number.parseFloat(
      sushiSwapV4TickToPrice(token0, token1, slot0.data.tick).toSignificant(8),
    )
  }, [slot0.data, token0, token1])

  return {
    series,
    currentPrice,
    isLoading: slot0.isLoading || ticks.isLoading,
    // A failed refetch keeps the chart it already has
    error:
      slot0.data && ticks.data ? null : (slot0.error ?? ticks.error ?? null),
    isEmpty: Boolean(slot0.data && ticks.data && !ticks.data.length),
  }
}
