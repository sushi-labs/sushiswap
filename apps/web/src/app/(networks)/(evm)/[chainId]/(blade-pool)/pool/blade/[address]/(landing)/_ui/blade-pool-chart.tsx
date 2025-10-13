'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Card } from '@sushiswap/ui'
import React, { type FC, useState } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'
import { PoolChartGraph } from '~evm/[chainId]/pool/_ui/pool-chart-graph'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import {
  PoolChartType,
  PoolChartTypes,
} from '~evm/[chainId]/pool/_ui/pool-chart-types'

const charts = [PoolChartType.Volume, PoolChartType.TVL] as const
const periods = [
  PoolChartPeriod.Day,
  PoolChartPeriod.Week,
  PoolChartPeriod.Month,
  PoolChartPeriod.Year,
  PoolChartPeriod.All,
]

interface BladePoolChartProps {
  pool: BladePool
}

const BladePoolChart: FC<BladePoolChartProps> = ({ pool }) => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4 border-accent border-b px-6 py-4">
        <PoolChartTypes
          charts={charts}
          selectedChart={chart}
          setChart={setChart}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      <PoolChartGraph
        chart={chart}
        period={period}
        pool={pool}
        protocol={SushiSwapProtocol.BLADE}
      />
    </Card>
  )
}

export { BladePoolChart }
