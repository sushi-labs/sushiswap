import { useCallback, useMemo } from 'react'

import { ChartEntry } from './types'
import { Type } from '@sushiswap/currency'
import { FeeAmount, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { TickProcessed, useConcentratedActiveLiquidity } from '../../lib/hooks/useConcentratedActiveLiquidity'

export function useDensityChartData({
  chainId,
  token0,
  token1,
  feeAmount,
}: {
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
}) {
  const { isLoading, error, data } = useConcentratedActiveLiquidity({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: !isLoading ? formatData() : undefined,
    }
  }, [isLoading, error, formatData])
}
