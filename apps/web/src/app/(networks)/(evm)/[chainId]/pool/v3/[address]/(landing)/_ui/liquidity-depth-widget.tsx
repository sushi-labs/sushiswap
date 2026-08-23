'use client'

import { SkeletonBox } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query/pools/use-concentrated-liquidity-pool-stats'
import type { SushiSwapV3ChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { useDensityChartData } from '~evm/[chainId]/_ui/liquidity-chart-range-input/hooks'
import { DepthChart } from './depth-chart'

interface LiquidityDepthWidget {
  address: Address
  chainId: SushiSwapV3ChainId
}

// ID has to be set (and unique) if there are multiple charts on the same page
export const LiquidityDepthWidget: FC<LiquidityDepthWidget> = ({
  address,
  chainId,
}) => {
  const { data: poolStats, isLoading: isPoolStatsLoading } =
    useConcentratedLiquidityPoolStats({ chainId, address })

  const {
    price,
    invertPrice,
    noLiquidity,
    isLoading: isMintInfoLoading,
  } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading: isDensityDataLoading, data } = useDensityChartData({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const current = useMemo(() => {
    if (!price) return null

    return Number.parseFloat(
      (invertPrice ? price.invert() : price)?.toSignificant(8),
    )
  }, [invertPrice, price])

  const isLoading =
    isPoolStatsLoading ||
    (Boolean(poolStats) && (isMintInfoLoading || isDensityDataLoading))

  if (isLoading) {
    return <SkeletonBox className="h-[380px] w-full" />
  }

  if (noLiquidity || !poolStats || !data || !current) {
    return (
      <div className="flex h-[380px] items-center justify-center text-sm text-muted-foreground">
        Liquidity depth is unavailable for this pool.
      </div>
    )
  }

  return (
    <DepthChart
      series={data}
      currentPrice={current}
      baseSymbol={poolStats.token0.symbol ?? 'Token 0'}
      quoteSymbol={poolStats.token1.symbol ?? 'Token 1'}
      token0Decimals={poolStats.token0.decimals}
      token1Decimals={poolStats.token1.decimals}
    />
  )
}
