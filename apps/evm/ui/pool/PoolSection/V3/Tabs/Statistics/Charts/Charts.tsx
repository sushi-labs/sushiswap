import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import React, { FC, useMemo, useState } from 'react'

import { PoolChartGraph, PoolChartPeriod, PoolChartPeriods, PoolChartType, PoolChartTypes } from '../../../../PoolChart'
import { LiquidityDepthWidget } from './LiquidityDepthWidget'

const charts = [PoolChartType.Volume, PoolChartType.TVL, PoolChartType.Fees, PoolChartType.Depth]

interface Charts {
  address: string
  chainId: SushiSwapV3ChainId
}

export const Charts: FC<Charts> = ({ address, chainId }) => {
  const [chart, setChart] = useState<PoolChartType>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  const periods = useMemo(() => {
    if (chart === PoolChartType.Depth) return []

    return [PoolChartPeriod.Day, PoolChartPeriod.Week, PoolChartPeriod.Month, PoolChartPeriod.Year, PoolChartPeriod.All]
  }, [chart])

  return (
    <div className="flex flex-col gap-6 h-[520px]">
      <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
        <PoolChartTypes charts={charts} selectedChart={chart} setChart={setChart} />
        <PoolChartPeriods periods={periods} selectedPeriod={period} setPeriod={setPeriod} />
      </div>
      {chart === PoolChartType.Depth ? (
        <LiquidityDepthWidget chainId={chainId} address={address} />
      ) : (
        <PoolChartGraph chart={chart} period={period} address={address} chainId={chainId} />
      )}
    </div>
  )
}
