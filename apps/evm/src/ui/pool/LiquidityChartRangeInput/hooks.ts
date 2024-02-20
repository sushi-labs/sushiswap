import { FeeAmount, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useMemo } from 'react'
import { TickProcessed, useConcentratedActiveLiquidity } from 'src/lib/pool/v3'
import { Type } from 'sushi/currency'

import { ChartEntry } from './types'

interface UseDensityChartData {
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  feeAmount: FeeAmount | undefined
  enabled?: boolean
}

export function useDensityChartData({
  chainId,
  token0,
  token1,
  feeAmount,
  enabled = true,
}: UseDensityChartData) {
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
