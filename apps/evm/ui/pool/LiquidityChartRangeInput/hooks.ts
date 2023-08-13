import { Type } from '@sushiswap/currency'
import { FeeAmount, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { TickProcessed, useConcentratedActiveLiquidity } from 'lib/hooks/useConcentratedActiveLiquidity'
import { useMemo } from 'react'

import { ChartEntry } from './types'

export function useDensityChartData({
  chainId,
  token0,
  token1,
  feeAmount,
  enabled,
}: {
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
  enabled?: boolean
}) {
  const activeLiquidity = useConcentratedActiveLiquidity({
    chainId,
    token0,
    token1,
    feeAmount,
    enabled,
  })

  return useMemo(() => {
    const data = activeLiquidity.data
    if (!data) return activeLiquidity

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

    return {
      ...activeLiquidity,
      data: newData,
    }
  }, [activeLiquidity])
}
