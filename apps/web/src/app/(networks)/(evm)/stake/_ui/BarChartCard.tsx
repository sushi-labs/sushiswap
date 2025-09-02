'use client'

import { Card } from '@sushiswap/ui'
import { useState } from 'react'
import { BarChartGraph } from './BarChartGraph'
import { BarChartPeriod, BarChartPeriods } from './BarChartPeriods'
import { BarChartType, BarChartTypes } from './BarChartTypes'

const charts = [BarChartType.APR, BarChartType.TotalSupply] as const
const periods = [
  BarChartPeriod.Day,
  BarChartPeriod.Week,
  BarChartPeriod.Month,
  BarChartPeriod.Year,
  BarChartPeriod.All,
]

export const BarChartCard = () => {
  const [chart, setChart] = useState<(typeof charts)[number]>(charts[0])
  const [period, setPeriod] = useState<BarChartPeriod>(BarChartPeriod.Year)

  return (
    <Card>
      <div className="border-b border-accent px-6 py-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <BarChartTypes
          charts={charts}
          selectedChart={chart}
          setChart={setChart}
        />
        <BarChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      <BarChartGraph chart={chart} period={period} />
    </Card>
  )
}
