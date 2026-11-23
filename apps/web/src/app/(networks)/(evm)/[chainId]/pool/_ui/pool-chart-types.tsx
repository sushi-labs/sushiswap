import { Toggle, ToggleGroup } from '@sushiswap/ui'

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

export function PoolChartTypes<C extends string>({
  charts,
  selectedChart,
  setChart,
}: PoolChartTypesProps<C>) {
  return (
    <ToggleGroup>
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
    </ToggleGroup>
  )
}
