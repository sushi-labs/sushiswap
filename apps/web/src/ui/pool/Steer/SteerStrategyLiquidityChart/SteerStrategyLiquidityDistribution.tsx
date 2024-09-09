'use client'

import { SkeletonBox } from '@sushiswap/ui'
import React, { FC, useMemo } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { SushiSwapV3ChainId } from 'sushi/config'
import { TickMath, tickToPrice } from 'sushi/pool/sushiswap-v3'
import type { PoolId } from 'sushi/types'
import { useConcentratedDerivedMintInfo } from '../../ConcentratedLiquidityProvider'
import { useDensityChartData } from '../../LiquidityChartRangeInput/hooks'
import { SteerStrategyGeneric } from '../SteerStrategies'
import { SteerStrategyLiquidityDistributionChart } from './SteerStrategyLiquidityDistributionChart'

interface SteerStrategyLiquidityDistribution {
  pool: PoolId
  positions: SteerStrategyGeneric['positions']
}

export const SteerStrategyLiquidityDistribution: FC<
  SteerStrategyLiquidityDistribution
> = (props) => {
  return (
    <div className="h-full w-full rounded-xl flex items-center justify-center">
      <_SteerStrategyLiquidityDistribution {...props} />
    </div>
  )
}

const _SteerStrategyLiquidityDistribution: FC<
  SteerStrategyLiquidityDistribution
> = ({ pool, positions }) => {
  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId: pool.chainId as SushiSwapV3ChainId,
    address: pool.address,
  })

  const {
    price,
    invertPrice,
    isLoading: isMintInfoLoading,
  } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId: pool.chainId as SushiSwapV3ChainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading: isDensityDataLoading, data } = useDensityChartData({
    chainId: pool.chainId as SushiSwapV3ChainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const [steerRange, rangeState] = useMemo(() => {
    if (!poolStats) return [null, 'loading' as const]

    const min = Math.min(
      ...positions.map((position) => Number(position.lowerTick)),
    )
    const max = Math.max(
      ...positions.map((position) => Number(position.upperTick)),
    )

    if (min < TickMath.MIN_TICK || max > TickMath.MAX_TICK || min > max) {
      return [null, 'invalid' as const]
    }

    return [
      {
        minPrice: Number(
          tickToPrice(poolStats?.token0, poolStats?.token1, min).toSignificant(
            12,
          ),
        ),
        maxPrice: Number(
          tickToPrice(poolStats?.token0, poolStats?.token1, max).toSignificant(
            12,
          ),
        ),
      },
      'valid' as const,
    ]
  }, [positions, poolStats])

  const current = useMemo(() => {
    if (!price) return null

    return parseFloat((invertPrice ? price.invert() : price)?.toSignificant(8))
  }, [invertPrice, price])

  const isLoading =
    rangeState === 'loading' || isMintInfoLoading || isDensityDataLoading

  if (isLoading) {
    return <SkeletonBox className="w-full h-full" />
  }

  if (rangeState === 'invalid' || !data || !current || !steerRange) {
    return <div className="text-slate-300 text-sm">Invalid data.</div>
  }

  return (
    <div className="bg-secondary w-full h-full">
      <SteerStrategyLiquidityDistributionChart
        series={data}
        current={current}
        steerRange={steerRange}
      />
    </div>
  )
}
