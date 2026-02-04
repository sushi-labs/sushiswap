'use client'

import { useMemo } from 'react'
import type { ChartEntry } from '~evm/[chainId]/_ui/LiquidityChartRangeInput/types'
import type { PoolInfo } from '../../types/pool.type'
import {
  type TickProcessed,
  useConcentratedActiveLiquidity,
} from './use-concentrated-active-liquidity'

interface UseDensityChartDataProps {
  pool: PoolInfo | null | undefined
  enabled?: boolean
}

/**
 * Hook that transforms tick data into chart-ready format
 * for the liquidity density visualization
 */
export function useDensityChartData({
  pool,
  enabled = true,
}: UseDensityChartDataProps) {
  const activeLiquidity = useConcentratedActiveLiquidity({
    pool,
    enabled,
  })

  return useMemo(() => {
    const data = activeLiquidity.data
    if (!data) return activeLiquidity

    const newData: ChartEntry[] = []
    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: Number(t.liquidityActive),
        price0: Number.parseFloat(t.price0),
      }

      newData.push(chartEntry)
    }

    return {
      ...activeLiquidity,
      data: newData,
    }
  }, [activeLiquidity])
}
