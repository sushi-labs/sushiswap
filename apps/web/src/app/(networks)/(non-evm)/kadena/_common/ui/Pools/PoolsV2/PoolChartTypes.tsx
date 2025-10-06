import { Toggle } from '@sushiswap/ui'
import React from 'react'

interface PoolChartTypesProps<C> {
  charts: Readonly<C[]>
  selectedChart: C
  setChart: (chart: C) => void
}

export function PoolChartTypes<C extends string>({
  charts,
  selectedChart,
  setChart,
}: PoolChartTypesProps<C>) {
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
