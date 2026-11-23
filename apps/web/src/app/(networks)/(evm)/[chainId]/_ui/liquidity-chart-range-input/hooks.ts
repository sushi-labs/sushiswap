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

export function getDensityChartData(
  data: TickProcessed[],
  inverted = false,
): ChartEntry[] {
  const series = data.flatMap(({ liquidityActive, liquidityNet, price0 }) => {
    // Each step describes the interval to its right. With inverse prices that
    // interval lies below the tick, before its liquidity change is applied.
    const liquidity = inverted
      ? liquidityActive - liquidityNet
      : liquidityActive
    return liquidity >= 0n
      ? [
          {
            activeLiquidity: Number(liquidity),
            price0: Number.parseFloat(price0),
          },
        ]
      : []
  })
  return inverted ? series.reverse() : series
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

    const inverted = Boolean(
      token0 && token1 && token1.wrap().sortsBefore(token0.wrap()),
    )
    return {
      ...activeLiquidity,
      data: getDensityChartData(data, inverted),
    }
  }, [activeLiquidity, token0, token1])
}
