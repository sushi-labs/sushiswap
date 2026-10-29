import { Card } from '@sushiswap/ui'
import React, { type FC, type ReactNode, useMemo, useState } from 'react'
import { PoolChartGraph } from './pool-chart-graph'
import { PoolChartPeriod, PoolChartPeriods } from './pool-chart-periods'
import { PoolChartType, PoolChartTypes } from './pool-chart-types'

const statisticsChart = [
  PoolChartType.Volume,
  PoolChartType.TVL,
  PoolChartType.Fees,
  PoolChartType.Depth,
]

interface PoolStatisticsChartsProps {
  pool: Parameters<typeof PoolChartGraph>[0]['pool']
  protocol: Parameters<typeof PoolChartGraph>[0]['protocol']
  /** Rendered when the depth chart is selected */
  depthChart: ReactNode
}

export const PoolStatisticsCharts: FC<PoolStatisticsChartsProps> = ({
  pool,
  protocol,
  depthChart,
}) => {
  const [chart, setChart] = useState<PoolChartType>(statisticsChart[0])
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  const periods = useMemo(() => {
    if (chart === PoolChartType.Depth) return []

    return [
      PoolChartPeriod.Day,
      PoolChartPeriod.Week,
      PoolChartPeriod.Month,
      PoolChartPeriod.Year,
      PoolChartPeriod.All,
    ]
  }, [chart])

  return (
    <Card className="self-start overflow-hidden">
      <div className="border-b border-accent px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <PoolChartTypes
          charts={statisticsChart}
          selectedChart={chart}
          setChart={setChart}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      {chart === PoolChartType.Depth ? (
        depthChart
      ) : (
        <PoolChartGraph
          chart={chart}
          period={period}
          pool={pool}
          protocol={protocol}
          height={260}
        />
      )}
    </Card>
  )
}
