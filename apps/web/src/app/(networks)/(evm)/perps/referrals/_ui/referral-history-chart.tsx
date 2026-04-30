'use client'

import type { PerpsSushiReferralFeePoint } from '@sushiswap/graph-client/data-api'
import { SkeletonBox, SkeletonChartLoadingStateMask } from '@sushiswap/ui'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart } from 'echarts/charts'
import { TitleComponent } from 'echarts/components'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useMemo } from 'react'
import { formatUSD } from 'sushi'
import type { HistoryFilter } from './referral-history-card'

echarts.use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  GridComponent,
  TitleComponent,
])

const getAxisValues = (count: number, start?: Date, end?: Date) => {
  if (start === undefined || end === undefined) return []

  const values: number[] = []
  const step = (end.getTime() - start.getTime()) / (count - 1)

  for (let i = 0; i < count; i++) {
    values.push(start.getTime() + step * i)
  }

  return values
}

const getTimeFrameString = (filter: HistoryFilter) => {
  switch (filter) {
    case '7D':
      return 'in the last 7 days'
    case '30D':
      return 'in the last 30 days'
    case 'All':
      return 'yet'
  }
}

export function ReferralHistoryChart({
  data,
  historyFilter,
  setDataToShow,
}: {
  data: PerpsSushiReferralFeePoint[]
  historyFilter: HistoryFilter
  setDataToShow: React.Dispatch<
    React.SetStateAction<{ amount: number; date: string }>
  >
}) {
  const type = 'day'

  const option = useMemo<EChartOption>(() => {
    const hasData = !!data.length
    const points = data.map((point) => [point.date, point.amount])

    const minTime = points.reduce(
      (min, point) => Math.min(min, new Date(point[0]).getTime()),
      Number.POSITIVE_INFINITY,
    )
    const maxTime = points.reduce(
      (max, point) => Math.max(max, new Date(point[0]).getTime()),
      Number.NEGATIVE_INFINITY,
    )
    const meta = {
      start: new Date(minTime),
      end: new Date(maxTime),
    }

    return {
      title: [
        {
          text: `No rewards ${getTimeFrameString(historyFilter)}.`,
          show: !hasData,
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 500,
            color: '#EDF0F380',
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
          const value = point.value as [string, number]
          setDataToShow({
            amount: value[1],
            date: value[0],
          })
          return `${value[0].replaceAll('-', '/')}: ${formatUSD(value[1])}`
        },
      },
      grid: {
        top: 10,
        left: 40,
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
          min: meta?.start.getTime(),
          max: meta?.end.getTime(),
          axisLabel: {
            customValues: getAxisValues(5, meta?.start, meta?.end),
            align: 'center',
            color: '#A9A9A9',
            fontWeight: 600,
            margin: 20,
            padding: [0, 0, 0, 0],
            formatter: (value: number) => {
              const date = new Date(value)

              if (type === 'day') {
                return `${date.toLocaleString('en-US', {
                  month: 'short',
                })} ${date.getDate()}`
              }

              return `${date.getHours() % 13} ${date.getHours() > 12 ? 'PM' : 'AM'}`
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
          formatter: (value: number) =>
            value === 0 ? '$0' : formatUSD(value, '$0a'),
        },
        splitLine: {
          show: false,
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: 32,
          itemStyle: {
            color: '#349BFE',
            borderRadius: [8, 8, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: '#85B8FF',
            },
          },
          data: points,
        },
      ],
    }
  }, [data, historyFilter, setDataToShow])

  return (
    <ReactEchartsCore
      option={option}
      echarts={echarts}
      style={{ height: '300px', width: '100%' }}
    />
  )
}

export function ReferralHistoryChartSkeleton() {
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
