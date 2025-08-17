import { Toggle } from '@sushiswap/ui'
import React, { type FC } from 'react'
import type { PoolTimeFrame } from '~kadena/_common/lib/graphql/queries/get-pool-by-id-charts'

export enum PoolChartPeriod {
  Day = '1D',
  Week = '1W',
  Month = '1M',
  Year = '1Y',
  All = 'ALL',
}

export const PoolChartPeriodToTimeFrame: Record<
  PoolChartPeriod,
  PoolTimeFrame
> = {
  [PoolChartPeriod.Day]: 'DAY',
  [PoolChartPeriod.Week]: 'WEEK',
  [PoolChartPeriod.Month]: 'MONTH',
  [PoolChartPeriod.Year]: 'YEAR',
  [PoolChartPeriod.All]: 'ALL',
}

export const chartPeriods: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.Day]: 86400 * 1000,
  [PoolChartPeriod.Week]: 604800 * 1000,
  [PoolChartPeriod.Month]: 2629746 * 1000,
  [PoolChartPeriod.Year]: 31556952 * 1000,
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
          size="xs"
          pressed={period === selectedPeriod}
          onClick={() => setPeriod(period)}
          key={period}
        >
          {period === 'ALL' ? 'All' : period}
        </Toggle>
      ))}
    </div>
  )
}

export { PoolChartPeriods }
