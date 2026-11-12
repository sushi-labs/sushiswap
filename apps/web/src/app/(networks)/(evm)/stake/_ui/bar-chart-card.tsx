'use client'

import { Card, CardContent } from '@sushiswap/ui'
import { useState } from 'react'
import { BarChartGraph } from './bar-chart-graph'
import { BarChartPeriod, BarChartPeriods } from './bar-chart-periods'
import { BarChartType, BarChartTypes } from './bar-chart-types'

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
      <CardContent className="pt-6 !pb-3.5 !gap-2">
        <div className="flex flex-wrap gap-2 justify-between items-center">
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
      </CardContent>
    </Card>
  )
}
