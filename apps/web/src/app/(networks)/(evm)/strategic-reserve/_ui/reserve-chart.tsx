'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SkeletonBox,
} from '@sushiswap/ui'
import type { EChartsOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'
import { useBuybackReserveHistory } from 'src/lib/hooks/react-query/buyback/use-buyback-reserve-history'
import { perpsNumberFormatter } from 'src/lib/perps/utils'
import { formatNumber } from 'sushi'
import { reserveDateFormatter, reserveTimeFormatter } from '../_lib/format'

echarts.use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const chartDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

export function ReserveChart(): React.ReactElement {
  const { resolvedTheme } = useTheme()
  const { data, isLoading, isError } = useBuybackReserveHistory({
    enabled: true,
  })

  const points = data?.points ?? []
  const token = data?.token
  const latestPoint = points.at(-1)
  const latestAmount = perpsNumberFormatter({
    value: latestPoint?.amount ?? '0',
    minFraxDigits: 2,
    maxFraxDigits: 2,
  })
  const option = useMemo<EChartsOption>(() => {
    const isLight = resolvedTheme === 'light'
    const textColor = isLight ? '#64748B' : '#94A3B8'

    return {
      useUTC: true,
      animation: false,
      grid: { top: 24, left: 0, right: 12, bottom: 0, containLabel: true },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
        borderColor: isLight ? '#E2E8F0' : '#334155',
        textStyle: { color: isLight ? '#0F172A' : '#F8FAFC', fontSize: 12 },
        axisPointer: { lineStyle: { type: 'dashed', color: textColor } },
        formatter: (params) => {
          const point = Array.isArray(params) ? params[0] : params
          const value = point?.value
          if (!Array.isArray(value)) return ''
          const timestamp = Number(value[0])
          const amount = Number(value[1])
          if (!Number.isFinite(timestamp) || !Number.isFinite(amount)) return ''

          return `${perpsNumberFormatter({ value: amount, minFraxDigits: 2, maxFraxDigits: 2 })} SUSHI<br/>${reserveDateFormatter.format(timestamp)}, ${reserveTimeFormatter.format(timestamp)} UTC`
        },
      },
      xAxis: {
        type: 'time',
        min: points[0]?.timestamp * 1000,
        max: latestPoint ? latestPoint.timestamp * 1000 : undefined,
        splitNumber: 3,
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: textColor,
          margin: 16,
          hideOverlap: true,
          formatter: (value: number) => chartDateFormatter.format(value),
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        splitNumber: 3,
        axisLabel: {
          color: textColor,
          margin: 16,
          formatter: (value: number) =>
            value === 0 ? '0' : formatNumber(value),
        },
        splitLine: {
          lineStyle: { color: isLight ? '#E2E8F0' : '#1E293B' },
        },
      },
      series: [
        {
          name: token?.symbol,
          type: 'line',
          step: 'end',
          showSymbol: true,
          symbol: 'circle',
          symbolSize: (_, params) => {
            const previous = points[params.dataIndex - 1]
            const current = points[params.dataIndex]
            return previous && current.amount !== previous.amount ? 8 : 0
          },
          itemStyle: { color: '#FA52A0' },
          lineStyle: { color: '#FA52A0', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FA52A040' },
              { offset: 1, color: '#FA52A000' },
            ]),
          },
          data: points.map((point) => [
            point.timestamp * 1000,
            Number(point.amount),
          ]),
        },
      ],
    }
  }, [points, latestPoint, token?.symbol, resolvedTheme])

  return (
    <Card>
      <CardHeader className="gap-2 px-4 md:px-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle>SUSHI held over time</CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {isLoading ? (
          <div role="status" aria-label="Loading reserve history">
            <SkeletonBox className="h-[260px] w-full" />
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="flex h-[260px] items-center justify-center text-sm text-red"
          >
            Unable to load reserve history.
          </div>
        ) : (
          <div
            role="img"
            aria-label={`SUSHI held over time: ${latestAmount} SUSHI in reserve.`}
          >
            <ReactEchartsCore
              echarts={echarts}
              option={option}
              style={{ height: 260 }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
