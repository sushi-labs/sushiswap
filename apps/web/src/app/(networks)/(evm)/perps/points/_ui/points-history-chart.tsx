'use client'

import type { PerpsPointsPoint } from '@sushiswap/graph-client/data-api'
import { SkeletonBox, SkeletonChartLoadingStateMask } from '@sushiswap/ui'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useMemo } from 'react'
import { formatNumber } from 'sushi'

echarts.use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  GridComponent,
  TitleComponent,
])

function getAxisValues(count: number, start?: Date, end?: Date): number[] {
  if (start === undefined || end === undefined) return []

  const values: number[] = []
  const step = (end.getTime() - start.getTime()) / (count - 1)

  for (let i = 0; i < count; i++) {
    values.push(start.getTime() + step * i)
  }

  return values
}

export function PointsHistoryChart({
  data,
}: {
  data: PerpsPointsPoint[]
}) {
  const option = useMemo<EChartOption>(() => {
    const hasData = data.length > 0
    const points = data.map((point) => [point.date, point.points])

    const start = hasData ? new Date(data[0]!.date) : undefined
    const end = hasData ? new Date(data[data.length - 1]!.date) : undefined

    return {
      title: [
        {
          text: 'No daily points yet.',
          show: !hasData,
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#94a3b8',
          },
          padding: [130, 0, 0, 0],
        },
      ],
      tooltip: {
        trigger: 'axis',
        show: hasData,
        padding: 8,
        borderWidth: 1,
        borderColor: '#629FFF50',
        backgroundColor: '#18223B',
        textStyle: {
          color: '#fff',
        },
        formatter: (params: any) => {
          const point = Array.isArray(params) ? params[0] : params
          const value = point.value
          return `${value[0].replaceAll('-', '/')}: ${formatNumber(value[1], 0)}`
        },
      },
      grid: {
        top: 10,
        left: 50,
        right: 32,
        bottom: 40,
      },
      xAxis: [
        {
          type: 'time',
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          min: start?.getTime(),
          max: end?.getTime(),
          axisLabel: {
            customValues: getAxisValues(5, start, end),
            align: 'center',
            color: '#A9A9A9',
            fontWeight: 600,
            margin: 20,
            padding: [0, 0, 0, 0],
            formatter: (value: number) => {
              const date = new Date(value)

              return `${date.toLocaleString('en-US', {
                month: 'short',
              })} ${date.getDate()}`
            },
          },
        },
      ],
      yAxis: {
        type: 'value',
        show: hasData,
        splitNumber: 3,
        axisLabel: {
          color: '#A9A9A9',
          fontSize: 12,
          fontWeight: 600,
          margin: 12,
          formatter: (value: number) => formatNumber(value, 0),
        },
        splitLine: {
          show: true,
          lineStyle: {
            opacity: 0.15,
          },
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2,
            color: '#629FFF',
          },
          areaStyle: {
            color: 'rgba(98, 159, 255, 0.12)',
          },
          data: points,
        },
      ],
    }
  }, [data])

  return (
    <ReactEchartsCore
      option={option}
      echarts={echarts}
      style={{ height: '300px', width: '100%' }}
    />
  )
}

export function PointsHistoryChartSkeleton() {
  const height = 300

  return (
    <div className="w-full flex flex-col h-[300px] space-y-2 pl-1">
      <div className="flex flex-row space-x-2">
        <div className="w-10">
          <SkeletonBox className="w-full h-full" />
        </div>
        <svg
          width="100%"
          height={height - 32}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          className="pr-10"
        >
          <SkeletonChartLoadingStateMask type="area" height={height - 36} />
        </svg>
      </div>
      <SkeletonBox className="w-full h-4" />
    </div>
  )
}
