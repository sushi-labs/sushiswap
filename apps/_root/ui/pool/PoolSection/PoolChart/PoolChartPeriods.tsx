import { Toggle } from '@sushiswap/ui/components/toggle'
import React, { FC } from 'react'

import { PoolChartPeriod } from './types'

interface PoolChartPeriodsProps {
  periods: PoolChartPeriod[]
  selectedPeriod: PoolChartPeriod
  setPeriod: (period: PoolChartPeriod) => void
}

const PoolChartPeriods: FC<PoolChartPeriodsProps> = ({ periods, selectedPeriod, setPeriod }) => {
  return (
    <div className="flex items-center gap-1">
      {periods.map((period) => (
        <Toggle size="xs" pressed={period === selectedPeriod} onClick={() => setPeriod(period)} key={period}>
          {period}
        </Toggle>
      ))}
    </div>
  )
}

export { PoolChartPeriods }
