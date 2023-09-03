import { Pool } from '@sushiswap/client'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { SkeletonBox } from '@sushiswap/ui'
import { SushiSwapV3ChainId, tickToPrice } from '@sushiswap/v3-sdk'
import React, { FC, useMemo } from 'react'

import { useConcentratedDerivedMintInfo } from '../../ConcentratedLiquidityProvider'
import { useDensityChartData } from '../../LiquidityChartRangeInput/hooks'
import { SteerStrategyGeneric } from '../Strategies'
import { SteerStrategyLiquidityDistributionChart } from './SteerStrategyLiquidityDistributionChart'

interface SteerStrategyLiquidityDistribution {
  pool: Pool
  positions: SteerStrategyGeneric['positions']
}

export const SteerStrategyLiquidityDistribution: FC<SteerStrategyLiquidityDistribution> = ({ pool, positions }) => {
  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId: pool.chainId as SushiSwapV3ChainId,
    address: pool.address,
  })

  const { price, invertPrice, noLiquidity } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId: pool.chainId as SushiSwapV3ChainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading, data } = useDensityChartData({
    chainId: pool.chainId as SushiSwapV3ChainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const steerRange = useMemo(() => {
    if (!poolStats) return null

    const min = Math.min(...positions.map((position) => Number(position.lowerTick)))
    const max = Math.max(...positions.map((position) => Number(position.upperTick)))

    return {
      minPrice: Number(tickToPrice(poolStats?.token0, poolStats?.token1, min).toSignificant(12)),
      maxPrice: Number(tickToPrice(poolStats?.token0, poolStats?.token1, max).toSignificant(12)),
    }
  }, [positions, poolStats])

  const current = useMemo(() => {
    if (!price) return null

    return parseFloat((invertPrice ? price.invert() : price)?.toSignificant(8))
  }, [invertPrice, price])

  return (
    <>
      {isLoading && <SkeletonBox className="w-full h-full" />}

      {!noLiquidity && steerRange && !isLoading && data && current && poolStats && (
        <SteerStrategyLiquidityDistributionChart series={data} current={current} steerRange={steerRange} />
      )}
    </>
  )
}
