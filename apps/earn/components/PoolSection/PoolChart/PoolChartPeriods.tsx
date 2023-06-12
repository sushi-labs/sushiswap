import { Button } from '@sushiswap/ui/future/components/button'
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
        <Button
          size="xs"
          variant={period === selectedPeriod ? 'outlined' : 'empty'}
          color={period === selectedPeriod ? 'blue' : 'default'}
          onClick={() => setPeriod(period)}
          className="!h-[24px] font-bold"
          key={period}
        >
          {period}
        </Button>
      ))}
    </div>
  )
}

export { PoolChartPeriods }
