'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Card } from '@sushiswap/ui'
import React, { type FC, useState } from 'react'
import { BLADE_PROTOCOL } from 'src/lib/pool/blade'
import { PoolChartGraph } from '../PoolChartGraph'
import { PoolChartPeriod, PoolChartPeriods } from '../PoolChartPeriods'
import { PoolChartType, PoolChartTypes } from '../PoolChartTypes'

const charts = [
  PoolChartType.Volume,
  PoolChartType.TVL,
  PoolChartType.Fees,
] as const
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
        protocol={BLADE_PROTOCOL}
      />
    </Card>
  )
}

export { BladePoolChart }
