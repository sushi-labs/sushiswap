import React, { FC, ReactNode } from 'react'
import colors from 'tailwindcss/colors'

import { useConcentratedDerivedMintInfo } from '../../../ConcentratedLiquidityProvider'
import { useIsMounted } from '@sushiswap/hooks'
import { FeeAmount, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { Chart } from 'components/LiquidityChartRangeInput/Chart'
import { useDensityChartData } from 'components/LiquidityChartRangeInput/hooks'
import { ZoomLevels } from 'components/LiquidityChartRangeInput/types'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import AutoSizer from 'react-virtualized-auto-sizer'

interface PoolDepthWidget {
  id?: string
  address: string
  chainId: SushiSwapV3ChainId
}

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.9,
    initialMax: 1.1,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.7,
    initialMax: 1.3,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.125,
    initialMax: 8,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.125,
    initialMax: 8,
    min: 0.00001,
    max: 20,
  },
}

// ID has to be set (and unique) if there are multiple charts on the same page
export const PoolDepthWidget: FC<PoolDepthWidget> = ({ id = 'PoolDepthWidget', address, chainId }) => {
  const isMounted = useIsMounted()

  const { data: poolStats } = useConcentratedLiquidityPoolStats({ chainId, address })

  const { price, invertPrice, ticksAtLimit, noLiquidity } = useConcentratedDerivedMintInfo({
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
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ width, height }}>
          {isLoading && <Skeleton.Box className="w-full h-full" />}

          {isMounted && !noLiquidity && !isLoading && formattedData && price && (
            <Chart
              id={id}
              data={{
                series: formattedData,
                current: parseFloat((invertPrice ? price.invert() : price).toSignificant(8)),
              }}
              dimensions={{ width, height }}
              margins={{ top: 10, right: 2, bottom: 80, left: 0 }}
              styles={{
                area: {
                  selection: colors.blue['500'],
                  opacity: 1,
                },
              }}
              interactive={true}
              zoomLevels={ZOOM_LEVELS[(poolStats?.feeAmount as FeeAmount) ?? FeeAmount.MEDIUM]}
              ticksAtLimit={ticksAtLimit}
            />
          )}
        </div>
      )}
    </AutoSizer>
  )
}
