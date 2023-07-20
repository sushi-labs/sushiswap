import { useIsMounted } from '@sushiswap/hooks'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import { SkeletonBox } from '@sushiswap/ui/components/skeleton'
import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import React, { FC } from 'react'

import { useConcentratedDerivedMintInfo } from '../../../ConcentratedLiquidityProvider'
import { useDensityChartData } from '../../../LiquidityChartRangeInput/hooks'
import { PoolDepthChart } from './PoolDepthChart'

interface PoolDepthWidget {
  id?: string
  address: string
  chainId: SushiSwapV3ChainId
}

// ID has to be set (and unique) if there are multiple charts on the same page
export const PoolDepthWidget: FC<PoolDepthWidget> = ({ address, chainId }) => {
  const isMounted = useIsMounted()

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address })

  const { price, invertPrice, noLiquidity } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading, formattedData } = useDensityChartData({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  return (
    <>
      {isLoading && <SkeletonBox className="w-full h-full" />}

      {isMounted && !noLiquidity && !isLoading && formattedData && price && poolStats && (
        <PoolDepthChart
          poolStats={poolStats}
          series={formattedData}
          current={parseFloat((invertPrice ? price.invert() : price).toSignificant(8))}
        />
      )}
    </>
  )
}
