'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import { CardContent, CardHeader, SkeletonBox, classNames } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ms from 'ms'
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'
import { useLocalRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
import { usePortfolioChart } from 'src/lib/wagmi/hooks/portfolio/use-portfolio-chart'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { useAccount } from 'wagmi'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { useChartFilters } from '~evm/[chainId]/portfolio/chart-filters-provider'
import { AssetsChartHeader, AssetsChartPeriod } from './assets-chart-header'
import {
  getSeries,
  getTooltipFormatter,
  getXAxisConfig,
  getYAxisConfig,
} from './chart-helpers'

echarts.use([
  ScatterChart,
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
])

const tailwind = resolveConfig(tailwindConfig)

export const AssetsChart = () => {
  const { address } = useAccount()
  const { data: recentSwaps } = useLocalRecentSwaps()
  const { data, isLoading } = usePortfolioChart({
    address: address,
  })

  const { chartRange } = useChartFilters()

  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isSmallScreen = useIsSmScreen()

  const [xData, yData] = useMemo(() => {
    const source = data?.dataPoints ?? []
    if (!source.length) return [[], []] as [number[], number[]]

    const sorted = [...source].sort((a, b) => a.timestamp - b.timestamp)

    const x = sorted.map((p) => p.timestamp * 1000)
    const y = sorted.map((p) => p.valueUSD)

    return [x, y]
  }, [data])

  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valNode = document.querySelector<HTMLElement>(
        '.usdValueHoveredValue',
      )
      const dateNode = document.querySelector<HTMLElement>(
        '.usdValueHoveredDate',
      )
      if (valNode) valNode.textContent = `${value.toFixed(2)}`
      if (dateNode)
        dateNode.textContent = format(new Date(name * ms('1s')), 'dd MMM yyyy')
    },
    [],
  )

  const formatLabel = (date: Date, period: AssetsChartPeriod): string => {
    switch (period) {
      case AssetsChartPeriod.OneDay:
        return format(date, 'h a')
      case AssetsChartPeriod.SevenDay:
        return format(date, 'eee')
      case AssetsChartPeriod.ThirtyDay:
        return format(date, 'MMM dd')
      case AssetsChartPeriod.All:
        return format(date, "MMM ''yy")
      default:
        return ''
    }
  }

  const markerSeries = useMemo(() => {
    const valueMap = new Map<number, number>()

    const result = recentSwaps
      ?.map((tx) => {
        const timestamp = tx.timestamp * ms('1s')
        const value = valueMap.get(timestamp)

        return {
          value: [timestamp, value ?? null],
          symbol: 'circle',
          symbolSize: 20,
          itemStyle: {
            color:
              tx.type === 'swap'
                ? isDark
                  ? '#1DA67D'
                  : '#1DA67D'
                : isDark
                  ? '#EA3830'
                  : '#DE5852',
            opacity: 1,
          },
          label: {
            show: true,
            formatter: tx.type === 'swap' ? 'S' : 'B',
            color: '#fff',
            fontWeight: 700,
            fontSize: 10,
          },
        }
      })
      .filter((point) => point.value[1] !== null)
    return result
  }, [isDark, recentSwaps])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const option = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        backgroundColor: 'transparent',
        textStyle: { fontSize: 12, fontWeight: 600 },
        axisPointer: { lineStyle: { type: 'dashed' } },
        formatter: getTooltipFormatter({ chartRange, onMouseOver }),
        borderWidth: 0,
      },
      grid: {
        top: isSmallScreen ? 10 : 30,
        left: isSmallScreen ? 65 : 99,
        right: 12,
        bottom: isSmallScreen ? 50 : 70,
      },
      color: [
        isDark
          ? (tailwind.theme?.colors?.skyblue as Record<string, string>)['500']
          : (tailwind.theme?.colors?.blue as Record<string, string>)['500'],
      ],
      xAxis: [
        getXAxisConfig({ chartRange, isSmallScreen, formatLabel, tailwind }),
      ],
      yAxis: [getYAxisConfig({ yData, isSmallScreen, tailwind })],
      series: getSeries(xData, yData, markerSeries),
    }),
    [xData, yData, chartRange, isDark, isSmallScreen, onMouseOver],
  )

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader className="!px-0 !p-4 md:!py-4">
        <AssetsChartHeader isLoading={isLoading} data={data} />
      </CardHeader>
      <CardContent className="!pb-2 !px-4">
        {isLoading ? (
          <SkeletonBox className="w-full h-[230px] mb-4 dark:via-slate-800 dark:to-slate-900" />
        ) : !data?.dataPoints?.length ? (
          <div className="flex justify-center items-center h-[246px] w-full">
            <span className="text-sm pb-10">No data available.</span>
          </div>
        ) : (
          <ReactEchartsCore
            echarts={echarts}
            option={option}
            style={{ height: 246 }}
          />
        )}
      </CardContent>
    </Wrapper>
  )
}
