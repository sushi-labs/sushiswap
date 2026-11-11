import { useMemo } from 'react'
import type { TickProcessed } from 'src/lib/pool/cl'
import { useConcentratedActiveLiquidity } from 'src/lib/pool/v3'
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
  const inverted = Number(data[0]?.price0) > Number(data.at(-1)?.price0)
  return (inverted ? data.toReversed() : data).flatMap((tick) => {
    // Inverted prices use liquidity before the tick instead of after it.
    const chartEntry = {
      activeLiquidity: Number(
        tick.liquidityActive - (inverted ? tick.liquidityNet : 0n),
      ),
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
