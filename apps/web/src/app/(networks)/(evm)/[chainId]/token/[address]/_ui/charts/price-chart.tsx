'use client'

import type { SushiSwapChainId } from '@sushiswap/graph-client/data-api'
import { CardContent, SkeletonBox, Toggle, ToggleGroup } from '@sushiswap/ui'
import format from 'date-fns/format'
import type {
  EChartsOption,
  TooltipComponentFormatterCallbackParams,
} from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import {
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTokenPriceChart } from 'src/lib/hooks/api/use-token-price-chart'
import { formatPercent, formatUSD } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import { SkeletonChart } from '~evm/[chainId]/_ui/skeleton-chart'
import {
  getStatsChartAxes,
  getStatsChartTooltip,
  getStatsLineStyle,
  statsChartColors,
} from '~evm/[chainId]/_ui/stats-chart-options'

echarts.use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const chartHeight = 300

enum CHART_DURATION {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

const timeframes = {
  [CHART_DURATION.DAY]: { label: '1D', dateFormat: 'h a' },
  [CHART_DURATION.WEEK]: { label: '1W', dateFormat: 'MMM d' },
  [CHART_DURATION.MONTH]: { label: '1M', dateFormat: 'MMM d' },
  [CHART_DURATION.YEAR]: { label: '1Y', dateFormat: 'MMM d yyyy' },
}

interface PriceChartProps {
  chainId: SushiSwapChainId
  address: EvmAddress
}

export function PriceChart({
  chainId,
  address,
}: PriceChartProps): ReactElement {
  const { resolvedTheme } = useTheme()

  const [duration, setDuration] = useState<CHART_DURATION>(CHART_DURATION.DAY)
  const priceRef = useRef<HTMLSpanElement>(null)
  const dateRef = useRef<HTMLSpanElement>(null)
  const diffRef = useRef<HTMLSpanElement>(null)

  const { data, isLoading } = useTokenPriceChart({
    chainId,
    address,
    duration,
  })

  const [
    chartData,
    currentPrice,
    currentDate,
    firstPrice,
    priceChange,
    yMin,
    yMax,
  ] = useMemo(() => {
    if (!data || data.length === 0)
      return [[], 0, 0, 0, 0, undefined, undefined]

    const transformed = data.map<[number, number]>((d) => [
      d.timestamp * 1000,
      d.close,
    ])

    const prices = data.map((d) => d.close)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const padding = (max - min) * 0.1

    const yMin = Math.max(0, min - padding)
    const yMax = max + padding

    const latest = transformed.at(-1)
    const first = transformed.at(0)

    const current = latest?.[1] ?? 0
    const initial = first?.[1] ?? 0
    const change = initial > 0 ? ((current - initial) / initial) * 100 : 0

    return [transformed, current, latest?.[0] ?? 0, initial, change, yMin, yMax]
  }, [data])

  const updateDOMLabels = useCallback(
    (price: number, timestamp: number) => {
      const priceNode = priceRef.current
      const dateNode = dateRef.current
      const diffNode = diffRef.current

      if (priceNode) priceNode.textContent = formatUSD(price)
      if (dateNode) {
        dateNode.textContent = format(
          new Date(timestamp),
          'dd MMM yyyy HH:mm aa',
        )
      }

      if (diffNode && firstPrice > 0) {
        const diff = price - firstPrice
        const percent = (diff / firstPrice) * 100
        const isPositive = percent >= 0
        diffNode.textContent = `${isPositive ? '+' : ''}${percent.toFixed(2)}%`
        diffNode.className = isPositive ? 'text-green' : 'text-red'
      }
    },
    [firstPrice],
  )

  const onTooltip = useCallback(
    (params: TooltipComponentFormatterCallbackParams) => {
      const item = Array.isArray(params) ? params[0] : params
      const point = item && chartData[item.dataIndex]
      if (point) updateDOMLabels(point[1], point[0])
      return ''
    },
    [chartData, updateDOMLabels],
  )

  const onMouseLeave = useCallback(() => {
    updateDOMLabels(currentPrice, currentDate)
  }, [updateDOMLabels, currentPrice, currentDate])

  const chartOptions = useMemo<EChartsOption>(() => {
    const axes = getStatsChartAxes({
      resolvedTheme,
      dateFormat: timeframes[duration].dateFormat,
    })
    const yAxis = Array.isArray(axes.yAxis) ? axes.yAxis[0] : axes.yAxis

    return {
      ...axes,
      tooltip: getStatsChartTooltip(onTooltip),
      color: [statsChartColors.v3],
      yAxis: {
        ...yAxis,
        type: 'value',
        position: 'right',
        min: yMin,
        max: yMax,
        interval: yMax && yMin ? (yMax - yMin) / 6 : undefined,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          hideOverlap: true,
          color: '#A0A0A0',
          formatter: (value: number) => formatUSD(value),
        },
      },
      series: [
        {
          type: 'line',
          data: chartData,
          ...getStatsLineStyle(statsChartColors.v3),
        },
      ],
    }
  }, [chartData, duration, resolvedTheme, yMin, yMax, onTooltip])

  return (
    <CardContent className="!gap-0 px-4 pb-3 sm:px-6" aria-busy={isLoading}>
      {isLoading ? (
        <>
          <div className="flex flex-col gap-1">
            <SkeletonBox className="h-8 sm:h-9 w-28" />
            <SkeletonBox className="h-4 w-16" />
          </div>
          <SkeletonChart type="area" height={chartHeight} />
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <span
                ref={priceRef}
                className="text-2xl sm:text-3xl text-primary"
              >
                {formatUSD(currentPrice)}
              </span>
              <div className="flex flex-wrap items-baseline gap-x-2 text-xs tabular-nums">
                <span
                  ref={diffRef}
                  className={
                    priceChange > 0
                      ? 'text-green'
                      : priceChange < 0
                        ? 'text-red'
                        : 'text-muted-foreground'
                  }
                >
                  {priceChange >= 0 ? '+' : ''}
                  {formatPercent(priceChange)}
                </span>
                <span ref={dateRef} className="text-muted-foreground" />
              </div>
            </div>
            <ToggleGroup
              className="shrink-0"
              role="group"
              aria-label="Price chart timeframe"
            >
              {Object.values(CHART_DURATION).map((timeframe) => (
                <Toggle
                  key={timeframe}
                  size="xs"
                  pressed={timeframe === duration}
                  onClick={() => setDuration(timeframe)}
                >
                  {timeframes[timeframe].label}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>
          <ReactEchartsCore
            echarts={echarts}
            option={chartOptions}
            style={{ height: chartHeight }}
            onEvents={{ globalout: onMouseLeave }}
            onChartReady={(chart) => {
              setTimeout(() => {
                chart.resize()
              }, 0)
            }}
          />
        </>
      )}
    </CardContent>
  )
}
