'use client'

import {
  CardContent,
  CardHeader,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { CardDescription, CardTitle } from '@sushiswap/ui'
import { SkeletonBox } from '@sushiswap/ui'
import format from 'date-fns/format'
import { type FC, useCallback, useMemo } from 'react'
import { formatNumber, formatPercent } from 'sushi/format'

import { useBarChartData } from 'src/lib/stake'
import { BarChartPeriod, chartPeriods } from './BarChartPeriods'
import { BarChartType } from './BarChartTypes'

import type { EChartOption } from 'echarts'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

interface BarChartProps {
  chart: BarChartType.APR | BarChartType.TotalSupply
  period: BarChartPeriod
}

echarts.use([LineChart, CanvasRenderer, GridComponent, TooltipComponent])

export const BarChartGraph: FC<BarChartProps> = ({ chart, period }) => {
  const { data: barData, isLoading } = useBarChartData()

  const [xData, yData] = useMemo(() => {
    const data =
      (period === BarChartPeriod.Day
        ? barData?.hourSnapshots
        : period === BarChartPeriod.Week || period === BarChartPeriod.Month
          ? barData?.daySnapshots
          : barData?.weekSnapshots) ?? []

    const currentDate = Math.round(Date.now())

    const [x, y] = data.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur.date * 1000 >= currentDate - chartPeriods[period]) {
          acc[0].push(cur.date)
          if (chart === BarChartType.APR) {
            acc[1].push(Number(cur.apr12m))
          } else if (chart === BarChartType.TotalSupply) {
            acc[1].push(Number(cur.xSushiSupply))
          }
        }
        return acc
      },
      [[], []],
    )

    return [x.reverse(), y.reverse()]
  }, [barData, period, chart])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      if (valueNodes[0]) {
        if (chart === BarChartType.APR) {
          valueNodes[0].innerHTML = formatPercent(value)
        } else {
          valueNodes[0].innerHTML = formatNumber(value)
        }
      }

      if (nameNodes[0]) {
        nameNodes[0].innerHTML = format(
          new Date(name * 1000),
          `dd MMM yyyy${
            chartPeriods[period] < chartPeriods[BarChartPeriod.Week] ? ' p' : ''
          }`,
        )
      }
    },
    [period, chart],
  )

  const DEFAULT_OPTION = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        // @ts-ignore
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        axisPointer: {
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm dark:text-slate-50 text-gray-900 font-medium">${
              chart === BarChartType.APR
                ? formatPercent(params[0].value)
                : formatNumber(params[0].value)
            }</span>
            <span class="text-xs text-gray-500 dark:text-slate-400 font-medium">${
              date instanceof Date && !Number.isNaN(date?.getTime())
                ? format(
                    date,
                    `dd MMM yyyy${
                      chartPeriods[period] < chartPeriods[BarChartPeriod.Week]
                        ? ' p'
                        : ''
                    }`,
                  )
                : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      grid: {
        top: 4,
        left: 4,
        right: 4,
        bottom: 0,
      },
      xAxis: [
        {
          boundaryGap: false,
          show: false,
          type: 'category',
          data: xData,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
        },
      ],
      series: [
        {
          type: 'line',
          smooth: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 2,
          data: yData,
        },
      ],
    }),
    [xData, chart, yData, onMouseOver, period],
  )

  return (
    <>
      <CardHeader>
        <CardTitle>
          {isLoading ? (
            <div>
              <SkeletonText fontSize="sm" className="!w-20" />
            </div>
          ) : (
            <span className="hoveredItemValue">
              {chart === BarChartType.APR
                ? formatPercent(yData[yData.length - 1])
                : formatNumber(yData[yData.length - 1])}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {xData.length ? (
            <div className="text-sm text-gray-500 dark:text-slate-500 hoveredItemName">
              {format(
                new Date(xData[xData.length - 1] * 1000),
                'dd MMM yyyy HH:mm',
              )}
            </div>
          ) : (
            <SkeletonText fontSize="sm" className="!w-32" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonBox
            className={classNames(
              'h-[200px] w-full dark:via-slate-800 dark:to-slate-900',
            )}
          />
        ) : (
          <ReactEChartsCore
            echarts={echarts}
            option={DEFAULT_OPTION}
            style={{ height: 200 }}
          />
        )}
      </CardContent>
    </>
  )
}
