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

export function getDensityChartData(data: TickProcessed[]): ChartEntry[] {
  return data.flatMap((tick) => {
    const chartEntry = {
      activeLiquidity: Number.parseFloat(tick.liquidityActive.toString()),
      price0: Number.parseFloat(tick.price0),
    }

    return chartEntry.activeLiquidity >= 0 ? [chartEntry] : []
  })
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

    return {
      ...activeLiquidity,
      data: getDensityChartData(data),
    }
  }, [activeLiquidity])
}
