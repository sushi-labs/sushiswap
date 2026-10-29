'use client'

import type { V4Pool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { useV4PoolDensityChartData } from 'src/lib/pool/v4'
import { LiquidityDepthChart } from '~evm/[chainId]/pool/_ui/liquidity-depth-chart'

export const LiquidityDepthWidgetV4: FC<{ pool: V4Pool }> = ({ pool }) => {
  const { chainId, address: poolId, token0, token1 } = pool

  const { series, currentPrice, isLoading } = useV4PoolDensityChartData({
    chainId,
    poolId,
    token0,
    token1,
  })

  return (
    <LiquidityDepthChart
      isLoading={isLoading}
      series={series}
      currentPrice={currentPrice}
      token0={token0}
      token1={token1}
    />
  )
}
