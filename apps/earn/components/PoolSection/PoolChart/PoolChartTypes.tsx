import { Button } from '@sushiswap/ui/future/components/button'
import React, { FC } from 'react'

interface PoolChartTypesProps<C> {
  charts: Readonly<C[]>
  selectedChart: C
  setChart: (chart: C) => void
}

function PoolChartTypes<C extends string>({ charts, selectedChart, setChart }: PoolChartTypesProps<C>) {
  return (
    <div className="flex items-center gap-1">
      {charts.map((chart) => (
        <Button
          size="xs"
          variant={chart === selectedChart ? 'outlined' : 'empty'}
          color={chart === selectedChart ? 'blue' : 'default'}
          onClick={() => setChart(chart)}
          className="!h-[24px] font-bold"
          key={chart}
        >
          {chart}
        </Button>
      ))}
    </div>
  )
}

export { PoolChartTypes }
