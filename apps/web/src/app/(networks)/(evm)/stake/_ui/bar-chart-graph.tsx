'use client'

import { SkeletonBox, SkeletonText, classNames } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { useBarChartData } from 'src/lib/stake'
import { formatNumber, formatPercent } from 'sushi'
import { BarChartPeriod, chartPeriods } from './bar-chart-periods'
import { BarChartType } from './bar-chart-types'

interface BarChartProps {
  chart: BarChartType.APR | BarChartType.TotalSupply
  period: BarChartPeriod
}

echarts.use([LineChart, CanvasRenderer, GridComponent, TooltipComponent])

export const BarChartGraph: FC<BarChartProps> = ({ chart, period }) => {
  const { data: barData, isLoading } = useBarChartData()
  const { resolvedTheme } = useTheme()

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

  const DEFAULT_OPTION = useMemo<EChartOption>(() => {
    const isLight = resolvedTheme === 'light'
    const textColor = isLight ? '#3b3b3b' : '#e3e3e3'
    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: isLight ? '#FFFFFF' : '#202020',
        borderColor: isLight ? '#e3e3e3' : '#3b3b3b',
        textStyle: { color: isLight ? '#181818' : '#ffffff', fontSize: 12 },
        axisPointer: { lineStyle: { type: 'dashed', color: textColor } },
        borderRadius: 12,
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5 ">
            <span class="text-sm  font-medium">${
              chart === BarChartType.APR
                ? formatPercent(params[0].value)
                : formatNumber(params[0].value)
            }</span>
            <span class="text-xs text-muted-foreground font-medium">${
              date instanceof Date && !Number.isNaN(date?.getTime())
                ? format(
                    date,
                    `MMM dd, yyyy${
                      chartPeriods[period] < chartPeriods[BarChartPeriod.Week]
                        ? ' p'
                        : ''
                    }`,
                  )
                : ''
            }</span>
          </div>`
        },
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
          show: true,
          type: 'value',
          splitNumber: 3,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: {
            show: true,
            lineStyle: { color: isLight ? '#e3e3e3' : '#3b3b3b' },
          },
        },
      ],
      series: [
        {
          type: 'line',
          showSymbol: false,
          itemStyle: { color: '#FA52A0' },
          lineStyle: { color: '#FA52A0', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FA52A040' },
              { offset: 1, color: '#FA52A000' },
            ]),
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 2,
          data: yData,
        },
      ],
    }
  }, [xData, chart, yData, onMouseOver, period, resolvedTheme])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col">
        {isLoading ? (
          <SkeletonText
            fontSize="3xl"
            className="!w-20"
            style={{ height: 36 }}
          />
        ) : (
          <span className="text-3xl font-medium hoveredItemValue">
            {chart === BarChartType.APR
              ? formatPercent(yData[yData.length - 1])
              : formatNumber(yData[yData.length - 1])}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <SkeletonText
            fontSize="xs"
            className="!w-20"
            style={{ height: 16 }}
          />
        ) : (
          <span className="text-xs text-muted-foreground">
            {format(new Date(xData[xData.length - 1] * 1000), 'MMM dd, yyyy')}
          </span>
        )}
      </div>
      {isLoading ? (
        <SkeletonBox className={classNames('h-[185.5px] w-full')} />
      ) : (
        <ReactEChartsCore
          echarts={echarts}
          option={DEFAULT_OPTION}
          style={{ height: 185.5 }}
        />
      )}
    </div>
  )
}
