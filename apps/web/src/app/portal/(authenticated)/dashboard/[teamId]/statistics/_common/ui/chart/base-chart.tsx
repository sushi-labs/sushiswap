'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import ReactEcharts from 'echarts-for-react'
import echarts, { type EChartOption } from 'echarts/lib/echarts'
import ms from 'ms'
import { useMemo, useState } from 'react'
import { formatNumber } from 'sushi/format'

const possibleTimeframes = ['24h', '7d', '30d'] as const
export type Timeframe = (typeof possibleTimeframes)[number]
const timeframeStrings: Record<(typeof possibleTimeframes)[number], string> = {
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
}

const interval: Record<Timeframe, number> = {
  '24h': ms('6h'),
  '7d': ms('1d'),
  '30d': ms('6d'),
}

interface BaseChart<EnabledTimeframes extends Timeframe[]> {
  title: string
  meta: {
    start: Date
    end: Date
  }
  timeframes: EnabledTimeframes | Readonly<EnabledTimeframes>
  selectedTimeframe: EnabledTimeframes[number]
  setTimeframe: (value: EnabledTimeframes[number]) => void
  data: { name: string; data: { date: Date; value: number }[] }[]
}

const colors = [
  '#c12e34',
  '#e6b600',
  '#0098d9',
  '#2b821d',
  '#005eaa',
  '#339ca8',
  '#cda819',
  '#32a487',
]

export function BaseChart<EnabledTimeframes extends Timeframe[]>({
  title,
  meta,
  selectedTimeframe,
  setTimeframe,
  timeframes,
  data: _data,
}: BaseChart<EnabledTimeframes>) {
  const data = useMemo(() => {
    return _data.map((item) => {
      return {
        name: item.name,
        data: item.data.map(
          (data) => [data.date.getTime(), data.value] as [number, number],
        ),
      }
    })
  }, [_data])

  const type = selectedTimeframe.includes('d') ? 'day' : 'hour'

  const hasData = data.length !== 0

  const DEFAULT_OPTION: EChartOption = useMemo(
    () => ({
      title: {
        text: 'No data',
        show: !hasData,
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 500,
          color: '#8D9BB0',
        },
        padding: [155, 0, 0, 0],
      },
      tooltip: {
        trigger: 'axis',
        show: hasData,
      },
      color: colors,
      grid: {
        top: 10,
        left: 56,
        right: 24,
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
          min: meta.start.getTime(),
          max: meta.end.getTime(),
          interval: interval[selectedTimeframe],
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
            align: 'center',
            inside: false,
            color: '#8D9BB0',
            fontWeight: 600,
            margin: 24,
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
          color: '#8D9BB0',
          fontSize: 12,
          fontWeight: 600,
          margin: 24,
          formatter: (number: number) =>
            formatNumber(Math.floor(number), 0)
              .replace('.00', '')
              .toUpperCase(),
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
      series: data.map(
        ({ name, data }) =>
          ({
            name,
            type: 'bar',
            stack: 'total',
            animation: false,
            data,
            barWidth: 10,
            barMinWidth: 10,
            barMaxWidth: '30%',
            barGap: '-20%',
          }) satisfies EChartOption.SeriesBar,
      ),
    }),
    [data, meta, type, hasData, selectedTimeframe],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex !flex-row justify-between w-full">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Total request count for selected period:{' '}
              <span className="text-primary">564,156,516</span>.
            </CardDescription>
          </div>
          <Select onValueChange={setTimeframe} value={selectedTimeframe}>
            <SelectTrigger className="max-w-[200px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe} value={timeframe}>
                  {timeframeStrings[timeframe]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ReactEcharts
          option={DEFAULT_OPTION}
          echarts={echarts}
          style={{ height: '350px' }}
        />
      </CardContent>
    </Card>
  )
}
