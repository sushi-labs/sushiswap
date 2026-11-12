import { Toggle, ToggleGroup } from '@sushiswap/ui'
import type { FC } from 'react'

export enum BarChartPeriod {
  Day = '1D',
  Week = '1W',
  Month = '1M',
  Year = '1Y',
  All = 'All',
}

export const chartPeriods: Record<BarChartPeriod, number> = {
  [BarChartPeriod.Day]: 86400 * 1000,
  [BarChartPeriod.Week]: 604800 * 1000,
  [BarChartPeriod.Month]: 2629746 * 1000,
  [BarChartPeriod.Year]: 31556952 * 1000,
  [BarChartPeriod.All]: Number.POSITIVE_INFINITY,
}

interface BarChartPeriodsProps {
  periods: BarChartPeriod[]
  selectedPeriod: BarChartPeriod
  setPeriod: (period: BarChartPeriod) => void
}

const BarChartPeriods: FC<BarChartPeriodsProps> = ({
  periods,
  selectedPeriod,
  setPeriod,
}) => {
  return (
    <ToggleGroup>
      {periods.map((period) => (
        <Toggle
          size="xs"
          pressed={period === selectedPeriod}
          onClick={() => setPeriod(period)}
          key={period}
        >
          {period}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export { BarChartPeriods }
