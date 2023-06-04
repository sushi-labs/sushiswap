import { Type } from '@sushiswap/currency'
import React, { FC, ReactNode } from 'react'
import colors from 'tailwindcss/colors'

import { useConcentratedDerivedMintInfo } from '../../../ConcentratedLiquidityProvider'
import { useAccount } from '@sushiswap/wagmi'
import { useIsMounted } from '@sushiswap/hooks'
import { FeeAmount, V3ChainId } from '@sushiswap/v3-sdk'
import { Chart } from 'components/LiquidityChartRangeInput/Chart'
import { useDensityChartData } from 'components/LiquidityChartRangeInput/hooks'
import { ZoomLevels } from 'components/LiquidityChartRangeInput/types'

interface PoolDepthWidget {
  id?: string
  chainId: V3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
  children?: ReactNode
  showStartPrice?: boolean
}

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOWEST]: {
    initialMin: 0.95,
    initialMax: 1.05,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.LOW]: {
    initialMin: 0.75,
    initialMax: 1.25,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.25,
    initialMax: 4,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.25,
    initialMax: 4,
    min: 0.00001,
    max: 20,
  },
}

// ID has to be set (and unique) if there are multiple charts on the same page
export const PoolDepthWidget: FC<PoolDepthWidget> = ({
  id = 'PoolDepthWidget',
  chainId,
  token0,
  token1,
  feeAmount,
  children,
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { price, invertPrice, ticksAtLimit, noLiquidity } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount,
    existingPosition: undefined,
  })

  const { isLoading, formattedData } = useDensityChartData({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  return (
    <>
      {children && children}
      <div className="flex flex-col gap-4 p-4 rounded-xl">
        {isMounted && !noLiquidity && !isLoading && formattedData && price && (
          <Chart
            id={id}
            data={{
              series: formattedData,
              current: parseFloat((invertPrice ? price.invert() : price).toSignificant(8)),
            }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: colors.blue['500'],
                opacity: 1,
              },
            }}
            interactive={true}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        )}
      </div>
    </>
  )
}
