'use client'

import { useMemo } from 'react'
import { tickToPoolPrice } from 'src/lib/functions'
import { processActiveLiquidity } from 'src/lib/pool/v3'
import type { EvmCurrency, SushiSwapV4ChainId } from 'sushi/evm'
import type { Hex } from 'viem'
import { getDensityChartData } from '~evm/[chainId]/_ui/liquidity-chart-range-input/hooks'
import { useV4PoolSlot0, useV4PoolTicks } from './use-v4-pool-state'

interface UseV4PoolDensityChartDataParams {
  chainId: SushiSwapV4ChainId
  poolId: Hex
  token0: EvmCurrency
  token1: EvmCurrency
}

/** Liquidity density around the current price, plus the current price itself. */
export function useV4PoolDensityChartData({
  chainId,
  poolId,
  token0,
  token1,
}: UseV4PoolDensityChartDataParams) {
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
      tickToPoolPrice(token0, token1, slot0.data.tick).toSignificant(8),
    )
  }, [slot0.data, token0, token1])

  return {
    series,
    currentPrice,
    isLoading: slot0.isLoading || ticks.isLoading,
  }
}
