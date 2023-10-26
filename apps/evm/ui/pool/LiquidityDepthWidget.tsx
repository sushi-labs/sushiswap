'use client'

import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { SkeletonBox } from '@sushiswap/ui/components/skeleton'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Bound } from 'lib/constants'
import React, { FC, useMemo } from 'react'

import { useConcentratedDerivedMintInfo } from './ConcentratedLiquidityProvider'
import LiquidityChartRangeInput from './LiquidityChartRangeInput'
import { useDensityChartData } from './LiquidityChartRangeInput/hooks'

interface LiquidityDepthWidget {
  address: string
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

    return parseFloat((invertPrice ? price.invert() : price)?.toSignificant(8))
  }, [invertPrice, price])

  return (
    <>
      {isLoading && <SkeletonBox className="w-full h-full" />}
      {!noLiquidity && !isLoading && data && current && poolStats && (
        <LiquidityChartRangeInput
          chainId={chainId}
          currencyA={poolStats.token0}
          currencyB={poolStats.token1}
          feeAmount={poolStats.feeAmount}
          ticksAtLimit={{ [Bound.LOWER]: false, [Bound.UPPER]: false }}
          price={
            price
              ? parseFloat(
                  (invertPrice ? price.invert() : price).toSignificant(8),
                )
              : undefined
          }
          priceLower={undefined}
          priceUpper={undefined}
          interactive={false}
          hideBrushes={true}
          onLeftRangeInput={() => {}}
          onRightRangeInput={() => {}}
        />
      )}
    </>
  )
}
