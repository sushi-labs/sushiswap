import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { Card } from '@sushiswap/ui'
import React, { type FC, useMemo, useState } from 'react'
import {
  type EvmAddress,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
} from 'sushi/evm'
import { PoolChartGraph } from '~evm/[chainId]/pool/_ui/pool-chart-graph'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import {
  PoolChartType,
  PoolChartTypes,
} from '~evm/[chainId]/pool/_ui/pool-chart-types'
import { LiquidityDepthWidget } from './liquidity-depth-widget'

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

export const StatisticsChartsV3: FC<Charts> = ({ address, chainId, pool }) => {
  const [chart, setChart] = useState<PoolChartType>(statisticsChart[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

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
    <Card className="self-start overflow-hidden">
      <div className="border-b border-accent px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <PoolChartTypes
          charts={statisticsChart}
          selectedChart={chart}
          setChart={setChart}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      {chart === PoolChartType.Depth ? (
        <LiquidityDepthWidget chainId={chainId} address={address} />
      ) : (
        <PoolChartGraph
          chart={chart}
          period={period}
          pool={pool}
          protocol={SushiSwapProtocol.SUSHISWAP_V3}
          height={260}
        />
      )}
    </Card>
  )
}
