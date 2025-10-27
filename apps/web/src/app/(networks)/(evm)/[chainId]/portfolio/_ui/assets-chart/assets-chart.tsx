'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import { CardContent, CardHeader, SkeletonBox } from '@sushiswap/ui'
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
import { useMemo } from 'react'
import { useCallback } from 'react'
import {
  filterLocalRecentSwapsByAccountAndToken,
  useLocalRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
import { usePortfolioChart } from 'src/lib/wagmi/hooks/portfolio/use-portfolio-chart'
import { EvmNative, EvmToken } from 'sushi/evm'
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

  const { chartRange, asset } = useChartFilters()

  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isSmallScreen = useIsSmScreen()

  const sortedData = useMemo(() => {
    if (!data?.dataPoints) return []
    return [...data.dataPoints].sort((a, b) => a.timestamp - b.timestamp)
  }, [data])

  const [xData, yData] = useMemo(() => {
    if (!sortedData.length) return [[], []] as [number[], number[]]

    const x = sortedData.map((p) => p.timestamp * ms('1s'))
    const y = sortedData.map((p) => p.valueUSD)

    return [x, y]
  }, [sortedData])

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

  const formatLabel = useCallback(
    (date: Date, period: AssetsChartPeriod): string => {
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
    },
    [],
  )

  const filteredRecentSwaps = useMemo(() => {
    if (!address || !recentSwaps || !asset) return []

    return filterLocalRecentSwapsByAccountAndToken({
      swaps: recentSwaps,
      account: address,
      token: asset,
    })
  }, [address, recentSwaps, asset])

  const markerSeries = useMemo(() => {
    if (!asset || !sortedData || sortedData?.length === 0) return []
    const result = filteredRecentSwaps
      ?.map((tx) => {
        const timestamp = tx.timestamp * ms('1000s')
        const nearestY = sortedData?.reduce((prev, curr) =>
          Math.abs(curr?.timestamp - tx.timestamp) <
          Math.abs(prev?.timestamp - tx.timestamp)
            ? curr
            : prev,
        )
        const value = nearestY?.valueUSD ?? null
        const token0 = tx.token0.isNative
          ? EvmNative.fromChainId(tx.token0.chainId)
          : new EvmToken({
              chainId: tx.token0.chainId,
              address: tx.token0.address,
              decimals: (tx.token0 as EvmToken).decimals,
              symbol: (tx.token0 as EvmToken).symbol,
              name: (tx.token0 as EvmToken).name,
            })

        const isSell = asset?.isSame(token0)
        return {
          value: [timestamp, value ?? null],
          symbol: 'circle',
          symbolSize: 20,
          itemStyle: {
            color: isSell
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
            formatter: isSell ? 'S' : 'B',
            color: '#fff',
            fontWeight: 700,
            fontSize: 10,
          },
        }
      })
      .filter((i) => i.value[1] !== null)

    return result
  }, [isDark, filteredRecentSwaps, sortedData, asset])

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
    [
      xData,
      yData,
      chartRange,
      isDark,
      isSmallScreen,
      onMouseOver,
      formatLabel,
      markerSeries,
    ],
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
