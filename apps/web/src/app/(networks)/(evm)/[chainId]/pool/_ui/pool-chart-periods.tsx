import { Toggle, ToggleGroup } from '@sushiswap/ui'

export enum PoolChartPeriod {
  Day = '1D',
  Week = '1W',
  Month = '1M',
  Year = '1Y',
  All = 'All',
}

export const chartPeriods: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.Day]: 86400 * 1000,
  [PoolChartPeriod.Week]: 604800 * 1000,
  [PoolChartPeriod.Month]: 2629746 * 1000,
  [PoolChartPeriod.Year]: 31556952 * 1000,
  [PoolChartPeriod.All]: Number.POSITIVE_INFINITY,
}

interface PoolChartPeriods<T extends PoolChartPeriod> {
  periods: T[]
  selectedPeriod: T
  setPeriod: (period: T) => void
}

export function PoolChartPeriods<T extends PoolChartPeriod>({
  periods,
  selectedPeriod,
  setPeriod,
}: PoolChartPeriods<T>) {
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
