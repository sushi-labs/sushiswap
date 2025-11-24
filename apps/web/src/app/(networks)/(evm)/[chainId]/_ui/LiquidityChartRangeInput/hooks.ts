import { useMemo } from 'react'
import {
  type TickProcessed,
  useConcentratedActiveLiquidity,
} from 'src/lib/pool/v3'
import type {
  EvmCurrency,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'
import type { ChartEntry } from './types'

interface UseDensityChartData {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  feeAmount: SushiSwapV3FeeAmount | undefined
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

    const newData: (ChartEntry & { price1: number; tick: number })[] = []
    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: Number.parseFloat(t.liquidityActive.toString()),
        price0: Number.parseFloat(t.price0),
        price1: Number.parseFloat(t.price1),
        tick: t.tick,
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
