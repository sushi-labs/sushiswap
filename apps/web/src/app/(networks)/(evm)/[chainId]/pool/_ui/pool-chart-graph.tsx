'use client'

import type {
  RawV2Pool,
  RawV3Pool,
  V2Pool,
  V3Pool,
} from '@sushiswap/graph-client/data-api'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { CardContent, SkeletonBox, classNames } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { usePoolGraphData } from 'src/lib/hooks'
import { formatUSD } from 'sushi'
import type {
  BladeChainId,
  SushiSwapProtocol,
  SushiSwapV2ChainId,
  SushiSwapV3ChainId,
} from 'sushi/evm'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'
import { PoolChartPeriod, chartPeriods } from './pool-chart-periods'
import { PoolChartType } from './pool-chart-types'

interface PoolChartProps {
  chart: PoolChartType.Volume | PoolChartType.Fees | PoolChartType.TVL
  period: PoolChartPeriod
  pool: RawV2Pool | V2Pool | RawV3Pool | V3Pool | BladePool
  protocol: SushiSwapProtocol
}

const tailwind = resolveConfig(tailwindConfig)

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
])

export const PoolChartGraph: FC<PoolChartProps> = ({
  chart,
  period,
  pool,
  protocol,
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const {
    data: buckets,
    isInitialLoading: isLoading,
    isError,
  } = usePoolGraphData({
    poolAddress: pool.address,
    chainId: Number(pool.chainId) as
      | SushiSwapV2ChainId
      | SushiSwapV3ChainId
      | BladeChainId,
    protocol,
  })

  const [xData, yData]: [number[], number[]] = useMemo(() => {
    const data =
      (chartPeriods[period] < chartPeriods[PoolChartPeriod.Week]
        ? buckets?.hourBuckets
        : buckets?.dayBuckets) || []

    const currentDate = Math.round(Date.now())
    const [x, y] = data.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur?.date * 1000 >= currentDate - chartPeriods[period]) {
          acc[0].push(cur?.date)
          if (chart === PoolChartType.Fees) {
            acc[1].push(Number(cur?.feesUSD))
          } else if (chart === PoolChartType.Volume) {
            acc[1].push(Number(cur?.volumeUSD))
          } else if (chart === PoolChartType.TVL) {
            acc[1].push(Number(cur?.liquidityUSD))
          }
        }
        return acc
      },
      [[], []],
    )

    return [x.reverse(), y.reverse()]
  }, [chart, period, buckets])

  const poolSwapFee = 'swapFee' in pool ? pool.swapFee : undefined
  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      if (valueNodes[0]) {
        valueNodes[0].innerHTML = formatUSD(value)
      }

      if (valueNodes[1]) {
        if (chart === PoolChartType.Volume && poolSwapFee !== undefined) {
          valueNodes[1].innerHTML = formatUSD(value * Number(poolSwapFee))
        }
      }

      if (nameNodes[0]) {
        nameNodes[0].innerHTML = format(
          new Date(name * 1000),
          `dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? ' p' : ''}`,
        )
      }
    },
    [period, chart, poolSwapFee],
  )

  const formatLabel = (date: Date, period: PoolChartPeriod): string => {
    switch (period) {
      case PoolChartPeriod.Day:
        return format(date, 'HH:mm')
      case PoolChartPeriod.Week:
        return format(date, 'EEE')
      case PoolChartPeriod.Month:
        return format(date, 'd MMM')
      case PoolChartPeriod.Year:
        return format(date, 'MMM')
      case PoolChartPeriod.All:
        return format(date, "MMM ''yy")
      default:
        return ''
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const DEFAULT_OPTION = useMemo<EChartOption>(() => {
    const range = xData[xData.length - 1] - xData[0]
    const padding = range * 0.01
    return {
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
          const [timestamp, value] = Array.isArray(params[0].value)
            ? params[0].value
            : [params[0].name, params[0].value]

          onMouseOver({ name: timestamp, value })

          const date = new Date(timestamp)
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm font-medium text-gray-900 dark:text-slate-50">${formatUSD(value)}</span>
            <span class="text-xs font-medium text-gray-500 dark:text-slate-400">${
              date instanceof Date && !Number.isNaN(date?.getTime())
                ? format(
                    date,
                    `dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? ' p' : ''}`,
                  )
                : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      toolbox: {
        show: false,
      },
      color: [
        isDark
          ? (tailwind.theme?.colors?.skyblue as Record<string, string>)['500']
          : (tailwind.theme?.colors?.blue as Record<string, string>)['500'],
      ],
      grid: {
        top: 0,
        left: period === PoolChartPeriod.All ? 18 : 7,
        right: 10,
        bottom: 40,
      },
      xAxis: [
        {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            formatter: (value: number) => formatLabel(new Date(value), period),
            hideOverlap: true,
            align: 'center',
            color: (tailwind.theme?.colors?.slate as Record<string, string>)[
              '450'
            ],
            fontWeight: 600,
          },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          splitNumber: period === PoolChartPeriod.All ? 8 : 6,
          // ✅ add small padding before and after the range
          min: (xData[0] - padding) * 1000,
          max: (xData[xData.length - 1] + padding) * 1000,
        },
      ],

      yAxis: [
        {
          show: false,
          type: 'value',
          name: 'Volume',
        },
      ],
      series: [
        {
          name: 'Volume',
          type: chart === PoolChartType.TVL ? 'line' : 'bar',
          smooth: true,
          xAxisIndex: 0,
          yAxisIndex: 0,
          barWidth: '70%',
          symbolSize: 5,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            // @ts-ignore
            color: isDark
              ? (tailwind.theme?.colors?.skyblue as Record<string, string>)[
                  '500'
                ]
              : (tailwind.theme?.colors?.blue as Record<string, string>)['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => Math.min(idx, 150),
          data: xData.map((x, i) => [x * 1000, yData[i]]),
        },
      ],
    }
  }, [xData, chart, yData, onMouseOver, period, isDark])

  return (
    <>
      <CardContent className="!pb-0">
        {isLoading ? (
          <SkeletonBox
            className={classNames(
              'my-6 h-[353px] w-full dark:via-slate-800 dark:to-slate-900',
            )}
          />
        ) : isError ? (
          <div className="h-[400px] w-full" />
        ) : (
          <ReactEchartsCore
            echarts={echarts}
            option={DEFAULT_OPTION}
            style={{ height: 400 }}
          />
        )}
      </CardContent>
    </>
  )
}
