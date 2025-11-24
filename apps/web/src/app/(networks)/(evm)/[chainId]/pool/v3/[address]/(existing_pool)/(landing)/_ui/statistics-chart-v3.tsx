import type { V3Pool } from '@sushiswap/graph-client/data-api'
import React, { type FC, useMemo, useState } from 'react'
import {
  type EvmAddress,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { PoolChartGraph } from '~evm/[chainId]/pool/_ui/pool-chart-graph'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import {
  PoolChartType,
  PoolChartTypes,
} from '~evm/[chainId]/pool/_ui/pool-chart-types'
import { DepthZoomButtons } from './depth-zoom-buttons'
import { LiquidityDepthChart } from './liquidity-depth-chart'

const statisticsChart = [
  PoolChartType.Volume,
  PoolChartType.TVL,
  PoolChartType.Fees,
  PoolChartType.Depth,
]

interface Charts {
  address: EvmAddress
  chainId: SushiSwapV3ChainId
  pool: V3Pool
}

export type DepthZoomType = {
  start: number
  end: number
}

export const StatisticsChartsV3: FC<Charts> = ({ address, chainId, pool }) => {
  const [chart, setChart] = useState<PoolChartType>(statisticsChart[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)
  const [zoomRange, setZoomRange] = useState<DepthZoomType>({
    start: 0,
    end: 100,
  })

  const periods = useMemo(() => {
    if (chart === PoolChartType.Depth) return []

    return [
      PoolChartPeriod.Day,
      PoolChartPeriod.Week,
      PoolChartPeriod.Month,
      PoolChartPeriod.Year,
      PoolChartPeriod.All,
    ]
  }, [chart])

  return (
    <Wrapper enableBorder className="!p-0">
      <div className="flex flex-col flex-wrap gap-4 px-6 py-4 border-b md:items-center md:justify-between border-accent md:flex-row">
        <PoolChartTypes
          charts={statisticsChart}
          selectedChart={chart}
          setChart={setChart}
        />

        {chart === PoolChartType.Depth ? (
          <DepthZoomButtons setZoomRange={setZoomRange} />
        ) : (
          <PoolChartPeriods
            periods={periods}
            selectedPeriod={period}
            setPeriod={setPeriod}
          />
        )}
      </div>
      {chart === PoolChartType.Depth ? (
        <LiquidityDepthChart
          zoomRange={zoomRange}
          chainId={chainId}
          address={address}
          setZoomRange={setZoomRange}
        />
      ) : (
        <PoolChartGraph
          chart={chart}
          period={period}
          pool={pool}
          protocol={SushiSwapProtocol.SUSHISWAP_V3}
        />
      )}
    </Wrapper>
  )
}
