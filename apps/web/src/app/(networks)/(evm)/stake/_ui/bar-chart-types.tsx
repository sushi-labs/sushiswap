import { Toggle, ToggleGroup } from '@sushiswap/ui'

export enum BarChartType {
  APR = 'APR',
  TotalSupply = 'Total Supply',
}

interface BarChartTypesProps<C> {
  charts: Readonly<C[]>
  selectedChart: C
  setChart: (chart: C) => void
}

function BarChartTypes<C extends string>({
  charts,
  selectedChart,
  setChart,
}: BarChartTypesProps<C>) {
  return (
    <ToggleGroup>
      {charts.map((chart) => (
        <Toggle
          size="sm"
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

export { BarChartTypes }
