'use client'

import { SkeletonBox } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'
import { Bound } from 'src/lib/constants'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import type { SushiSwapV3ChainId } from 'sushi/evm'
import type { Address } from 'viem'
import { LiquidityChart } from '~evm/[chainId]/_ui/LiquidityChart'
import { LiquidityChartRangeInput } from '~evm/[chainId]/_ui/LiquidityChartRangeInput'
import { useDensityChartData } from '~evm/[chainId]/_ui/LiquidityChartRangeInput/hooks'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'

interface LiquidityDepthWidget {
  address: Address
  chainId: SushiSwapV3ChainId
}

// ID has to be set (and unique) if there are multiple charts on the same page
export const LiquidityDepthWidget: FC<LiquidityDepthWidget> = ({
  address,
  chainId,
}) => {
  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })

  const { price, invertPrice, noLiquidity } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading, data } = useDensityChartData({
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

  return (
    <>
      {isLoading && <SkeletonBox className="w-full h-full" />}
      {!noLiquidity && !isLoading && data && current && poolStats && (
        <LiquidityChart
          chainId={chainId}
          token0={poolStats.token0}
          token1={poolStats.token1}
          feeAmount={poolStats.feeAmount}
        />
      )}
    </>
  )
}
