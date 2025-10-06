import { Toggle } from '@sushiswap/ui'
import ms from 'ms'
import React, { type FC } from 'react'

export enum PoolChartPeriod {
  Day = '1D',
  Week = '1W',
  Month = '1M',
  Year = '1Y',
  All = 'All',
}

export const chartPeriods: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.Day]: ms('1d'),
  [PoolChartPeriod.Week]: ms('1w'),
  [PoolChartPeriod.Month]: ms('1M'),
  [PoolChartPeriod.Year]: ms('1y'),
  [PoolChartPeriod.All]: Number.POSITIVE_INFINITY,
}

interface PoolChartPeriodsProps {
  periods: PoolChartPeriod[]
  selectedPeriod: PoolChartPeriod
  setPeriod: (period: PoolChartPeriod) => void
}

const PoolChartPeriods: FC<PoolChartPeriodsProps> = ({
  periods,
  selectedPeriod,
  setPeriod,
}) => {
  return (
    <div className="flex items-center gap-1">
      {periods.map((period) => (
        <Toggle
          variant="trade2"
          size="xs"
          pressed={period === selectedPeriod}
          onClick={() => setPeriod(period)}
          key={period}
        >
          {period}
        </Toggle>
      ))}
    </div>
  )
}

export { PoolChartPeriods }
