'use client'

import type { V4Pool } from '@sushiswap/graph-client/data-api'
import { type FC, useMemo } from 'react'
import { processActiveLiquidity } from 'src/lib/pool/v3'
import { useV4PoolSlot0, useV4PoolTicks } from 'src/lib/pool/v4'
import { tickToPrice } from 'sushi/evm'
import { getDensityChartData } from '~evm/[chainId]/_ui/liquidity-chart-range-input/hooks'
import { LiquidityDepthChart } from '~evm/[chainId]/pool/_ui/liquidity-depth-chart'

export const LiquidityDepthWidgetV4: FC<{ pool: V4Pool }> = ({ pool }) => {
  const { chainId, address: poolId, token0, token1 } = pool

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
      tickToPrice(token0.wrap(), token1.wrap(), slot0.data.tick).toSignificant(
        8,
      ),
    )
  }, [slot0.data, token0, token1])

  return (
    <LiquidityDepthChart
      isLoading={slot0.isLoading || ticks.isLoading}
      series={series}
      currentPrice={currentPrice}
      token0={token0}
      token1={token1}
    />
  )
}
