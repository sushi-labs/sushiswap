'use client'

import { useIsMounted } from '@sushiswap/hooks'
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
  SkeletonChart,
  classNames,
} from '@sushiswap/ui'
import format from 'date-fns/format'
import { useMemo } from 'react'
import { formatNumber } from 'sushi/format'

import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GraphicComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { type Timeframe, timeframeStrings } from '../constants'

const getAxisValues = (count: number, start?: Date, end?: Date) => {
  if (start === undefined || end === undefined) return []

  const values: number[] = []
  const step = (end.getTime() - start.getTime()) / (count - 1)

  for (let i = 0; i < count; i++) {
    values.push(start.getTime() + step * i)
  }

  return values
}

export type BaseChartBase<
  EnabledTimeframes extends Timeframe[] | Readonly<Timeframe[]>,
> = {
  title: string
  timeframes: EnabledTimeframes | Readonly<EnabledTimeframes>
  selectedTimeframe: EnabledTimeframes[number]
  setTimeframe: (value: EnabledTimeframes[number]) => void
  error?: boolean
  loading?: boolean
}

type BaseChartData = {
  meta: {
    start: Date
    end: Date
  }
  total?: bigint
  data: { name: string; data: { date: Date; value: number }[] }[]
}

type BaseChartLoading = {
  loading: true
}

type BaseChartError = {
  error: true
}

type BaseChart<EnabledTimeframes extends Timeframe[]> =
  BaseChartBase<EnabledTimeframes> &
    (BaseChartData | BaseChartLoading | BaseChartError)

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

echarts.use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  BarChart,
  TitleComponent,
  GraphicComponent,
])

export function BaseChart<EnabledTimeframes extends Timeframe[]>({
  title,
  selectedTimeframe,
  setTimeframe,
  timeframes,
  loading = false,
  error = false,
  ...rest
}: BaseChart<EnabledTimeframes>) {
  const total = 'total' in rest ? rest.total : null
  const _data = 'data' in rest ? rest.data : null
  const meta = 'meta' in rest ? rest.meta : null

  const data = useMemo(() => {
    return (
      _data?.map((item) => {
        return {
          name: item.name,
          data: item.data.map(
            (data) => [data.date.getTime(), data.value] as [number, number],
          ),
        }
      }) || []
    )
  }, [_data])

  const type = selectedTimeframe.includes('d') ? 'day' : 'hour'

  const hasData = data.length !== 0

  const DEFAULT_OPTION: EChartOption = useMemo(
    () => ({
      title: [
        {
          text: 'No data',
          show: !hasData && !error,
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 500,
            color: '#A9A9A9',
          },
          padding: [155, 0, 0, 0],
        },
        {
          text: 'An error occurred',
          show: error,
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 500,
            color: '#A9A9A9',
          },
          padding: [155, 0, 0, 0],
        },
      ],
      tooltip: {
        trigger: 'axis',
        show: hasData,
        padding: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        formatter: (_params) => {
          const params = (Array.isArray(_params) ? _params : [_params]).sort(
            (a, b) => b.data[1] - a.data[1],
          )

          const date = new Date(Number(params[0].data[0]))
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800 black:bg-muted px-4 py-3 rounded-xl overflow-hidden shadow-lg">
            ${params
              .map(
                (serie, i) =>
                  `<div key="${i}" class="flex flex-row justify-between items-center w-full space-x-8 text-sm text-primary">
                    <div class="flex flex-row items-center space-x-2">
                      <div class="w-2 h-2 rounded-full" style="background-color:${serie.color}"></div>
                      <span>${serie.seriesName}</span>
                    </div>
                    <span>
                      ${formatNumber(serie.data[1])}
                    </span>
                  </div>`,
              )
              .join('')}          
                    <span class="text-xs text-gray-500 dark:text-slate-400 black:text-muted-foreground font-medium mt-1">
                    ${
                      date instanceof Date && !Number.isNaN(date?.getTime())
                        ? format(
                            date,
                            `dd MMM yyyy${type === 'hour' ? ' p' : ''}`,
                          )
                        : ''
                    }</span>
                  </div>`
        },
      },
      color: colors,
      grid: {
        top: 10,
        left: 58,
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
          min: meta?.start.getTime(),
          max: meta?.end.getTime(),
          axisLabel: {
            customValues: getAxisValues(5, meta?.start, meta?.end),
            align: 'center',
            color: '#A9A9A9',
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
          color: '#A9A9A9',
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
    [data, meta, type, hasData, error],
  )

  const isMounted = useIsMounted()

  return (
    <Card>
      <CardHeader>
        <div className="flex !flex-row justify-between w-full">
          <div className="space-y-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription
              className={classNames(typeof total !== 'bigint' && 'opacity-0')}
            >
              Total request count for selected period:{' '}
              <span className="text-primary">{total?.toLocaleString()}</span>.
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
        {loading ? (
          isMounted ? (
            <SkeletonChart height={350} type="bar" />
          ) : null
        ) : (
          <ReactEchartsCore
            option={DEFAULT_OPTION}
            echarts={echarts}
            style={{ height: '350px', width: '100%' }}
          />
        )}
      </CardContent>
    </Card>
  )
}
