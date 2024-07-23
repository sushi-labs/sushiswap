import { Toggle } from '@sushiswap/ui'
import React from 'react'

export enum BarChartType {
  APR = 'APR',
  TotalSupply = 'Total Supply',
}

interface BarChartTypesProps<C> {
  charts: Readonly<C[]>
  selectedChart: C
  setChart: (chart: C) => void
}

function BarChartTypes<C extends string>({
  charts,
  selectedChart,
  setChart,
}: BarChartTypesProps<C>) {
  return (
    <div className="flex items-center gap-1">
      {charts.map((chart) => (
        <Toggle
          size="xs"
          pressed={chart === selectedChart}
          onClick={() => setChart(chart)}
          key={chart}
        >
          {chart}
        </Toggle>
      ))}
    </div>
  )
}

export { BarChartTypes }
