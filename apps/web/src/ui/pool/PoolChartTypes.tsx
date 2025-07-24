import { Toggle } from '@sushiswap/ui'
import React from 'react'

export enum PoolChartType {
  Volume = 'Volume',
  TVL = 'TVL',
  Fees = 'Fees',
  Depth = 'Depth',
}

interface PoolChartTypesProps<C> {
  charts: Readonly<C[]>
  selectedChart: C
  setChart: (chart: C) => void
}

function PoolChartTypes<C extends string>({
  charts,
  selectedChart,
  setChart,
}: PoolChartTypesProps<C>) {
  return (
    <div className="flex gap-1 items-center">
      {charts.map((chart) => (
        <Toggle
          variant="trade2"
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

export { PoolChartTypes }
