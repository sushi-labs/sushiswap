'use client'

import type {
  BladePool,
  RawV2Pool,
  RawV3Pool,
  V2Pool,
  V3Pool,
} from '@sushiswap/graph-client/data-api'
import { CardContent, SkeletonBox } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartsOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useCallback, useMemo, useState } from 'react'
import { usePoolGraphData } from 'src/lib/hooks/api/use-pool-graph-data'
import { formatUSD } from 'sushi'
import { SushiSwapProtocol } from 'sushi/evm'
import { SkeletonChart } from '~evm/[chainId]/_ui/skeleton-chart'
import {
  getStatsChartAxes,
  getStatsChartTooltip,
  getStatsLineStyle,
  statsChartColors,
} from '~evm/[chainId]/_ui/stats-chart-options'
import { PoolChartPeriod, chartPeriods } from './pool-chart-periods'
import { PoolChartType } from './pool-chart-types'

interface PoolChartProps {
  chart: PoolChartType.Volume | PoolChartType.Fees | PoolChartType.TVL
  period: PoolChartPeriod
  pool: RawV2Pool | V2Pool | RawV3Pool | V3Pool | BladePool
  protocol: SushiSwapProtocol
  height?: number
}

type ChartPoint = [timestamp: number, value: number]

const bucketFields = {
  [PoolChartType.Volume]: 'volumeUSD',
  [PoolChartType.Fees]: 'feesUSD',
  [PoolChartType.TVL]: 'liquidityUSD',
} as const

// Keep the time cutoff stable while hover updates the chart header.
function getChartPoints(
  buckets: ReturnType<typeof usePoolGraphData>['data'],
  chart: PoolChartProps['chart'],
  period: PoolChartPeriod,
): ChartPoint[] {
  const data =
    period === PoolChartPeriod.Day ? buckets?.hourBuckets : buckets?.dayBuckets
  const start = Date.now() - chartPeriods[period]

  return (data ?? [])
    .filter((bucket) => bucket.date * 1000 >= start)
    .map<ChartPoint>((bucket) => [
      bucket.date * 1000,
      bucket[bucketFields[chart]],
    ])
    .reverse()
}

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  GridComponent,
])

export function PoolChartGraph({
  chart,
  period,
  pool,
  protocol,
  height = 400,
}: PoolChartProps): React.ReactElement {
  const {
    data: buckets,
    isInitialLoading: isLoading,
    isError,
  } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: pool.chainId,
    protocol,
  })
  const { resolvedTheme } = useTheme()
  const isHourly = period === PoolChartPeriod.Day
  const dateFormat = isHourly ? 'MMM dd, yyyy p' : 'MMM dd, yyyy'
  const isTVL = chart === PoolChartType.TVL
  const points = useMemo(
    () => getChartPoints(buckets, chart, period),
    [buckets, chart, period],
  )

  const [hovered, setHovered] = useState<ChartPoint>()
  const onMouseLeave = useCallback(() => setHovered(undefined), [])
  const color =
    protocol === SushiSwapProtocol.SUSHISWAP_V3
      ? statsChartColors.v3
      : protocol === SushiSwapProtocol.BLADE
        ? statsChartColors.blade
        : statsChartColors.v2

  const option = useMemo<EChartsOption>(
    () => ({
      animation: false,
      ...getStatsChartAxes({
        resolvedTheme,
        dateFormat: isHourly ? 'HH:mm' : 'd MMM',
        min: isTVL ? points[0]?.[0] : undefined,
        max: isTVL ? points.at(-1)?.[0] : undefined,
      }),
      tooltip: {
        ...getStatsChartTooltip((params) => {
          const item = Array.isArray(params) ? params[0] : params
          const point = item ? points[item.dataIndex] : undefined
          setHovered(point)
          if (!point) return ''

          return `<div class="flex flex-col gap-0.5 font-medium">
            <span class="text-sm text-primary">${formatUSD(point[1])}</span>
            <span class="text-xs text-muted-foreground">${format(point[0], dateFormat)}</span>
          </div>`
        }),
        confine: true,
        padding: [8, 12],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'var(--accent)',
        backgroundColor: 'var(--secondary)',
      },
      color: [color],
      series: [
        isTVL
          ? {
              type: 'line',
              name: chart,
              data: points,
              ...getStatsLineStyle(color),
              showSymbol: points.length === 1,
            }
          : {
              type: 'bar',
              name: chart,
              data: points,
              itemStyle: { color, borderRadius: [2, 2, 0, 0] },
            },
      ],
    }),
    [chart, color, dateFormat, isHourly, isTVL, points, resolvedTheme],
  )

  const point = hovered && points.includes(hovered) ? hovered : points.at(-1)
  const value = point?.[1] ?? 0

  return (
    <CardContent className="pt-6 pb-3" aria-busy={isLoading}>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <>
            <SkeletonBox className="h-9 w-28" />
            <SkeletonBox className="h-4 w-24" />
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl sm:text-3xl text-primary">
                {formatUSD(value)}
              </span>
              {chart === PoolChartType.Volume && 'swapFee' in pool && (
                <span className="text-xs text-muted-foreground">
                  · {formatUSD(value * Number(pool.swapFee))} earned
                </span>
              )}
            </div>
            <span className="min-h-4 text-xs text-muted-foreground">
              {point && !isError && format(point[0], dateFormat)}
            </span>
          </>
        )}
      </div>
      {isLoading ? (
        <SkeletonChart type={isTVL ? 'area' : 'bar'} height={height} />
      ) : isError || !points.length ? (
        <div style={{ height }} />
      ) : (
        <ReactEchartsCore
          echarts={echarts}
          option={option}
          notMerge
          style={{ height }}
          onEvents={{ globalout: onMouseLeave }}
        />
      )}
    </CardContent>
  )
}
