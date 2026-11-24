'use client'

import {
  type V3PoolPricePeriod,
  getV3PoolPriceHistory,
} from '@sushiswap/graph-client/data-api'
import { Toggle, ToggleGroup } from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import format from 'date-fns/format'
import type { EChartsOption, MarkLineComponentOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import {
  type EvmAddress,
  type SushiSwapV3ChainId,
  getSushiSwapV3SubgraphUrl,
} from 'sushi/evm'
import { SkeletonChart } from '~evm/[chainId]/_ui/skeleton-chart'
import {
  getStatsChartAxes,
  getStatsChartTooltip,
  statsChartColors,
} from '~evm/[chainId]/_ui/stats-chart-options'

echarts.use([
  CanvasRenderer,
  LineChart,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
])

const periods: V3PoolPricePeriod[] = ['1D', '1W', '1M', '1Y', 'ALL']
const daysInPeriod = { '1D': 1, '1W': 7, '1M': 30, '1Y': 365 }
const priceFormatter = new Intl.NumberFormat('en', {
  maximumSignificantDigits: 8,
})
const compactFormatter = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 6,
})

function formatPrice(value: number, compact = false): string {
  if (value > 0 && value < 0.000001)
    return Number(value.toPrecision(6)).toExponential()
  if (compact && value >= 1000) return compactFormatter.format(value)
  return priceFormatter.format(value)
}

interface PriceHistoryProps {
  chainId: SushiSwapV3ChainId
  address: EvmAddress
  inverted: boolean
  currentPrice?: number
  priceLower?: number
  priceUpper?: number
  baseSymbol?: string
  quoteSymbol?: string
}

export function V3PositionPriceChart({
  liquidity,
  isPositionLoading,
  ...props
}: PriceHistoryProps & {
  liquidity: bigint | undefined
  isPositionLoading: boolean
}): React.ReactElement {
  if (getSushiSwapV3SubgraphUrl.supportsChainId(props.chainId)) {
    if (liquidity !== undefined && liquidity > 0n) {
      return <PoolPriceHistory {...props} />
    }
    if (liquidity === undefined && isPositionLoading) {
      return (
        <div
          className="w-full"
          aria-busy="true"
          aria-label="Loading price chart"
        >
          <SkeletonChart type="area" height={300} />
        </div>
      )
    }
  }

  return (
    <p
      role="status"
      className="mt-2 flex aspect-[2.6] min-h-[300px] w-full items-center justify-center rounded-xl border border-dashed border-accent bg-secondary px-4 text-center text-sm text-muted-foreground"
    >
      {liquidity === 0n
        ? 'This position is closed.'
        : 'Price chart unavailable.'}
    </p>
  )
}

function PoolPriceHistory({
  chainId,
  address,
  inverted,
  currentPrice,
  priceLower,
  priceUpper,
  baseSymbol,
  quoteSymbol,
}: PriceHistoryProps): React.ReactElement {
  const [period, setPeriod] = useState<V3PoolPricePeriod>('1W')
  const { resolvedTheme } = useTheme()
  const history = useQuery({
    queryKey: ['v3-pool-price-history', chainId, address.toLowerCase(), period],
    queryFn: ({ signal }) =>
      getV3PoolPriceHistory({ chainId, address, period }, { signal }),
    staleTime: 60_000,
  })

  const units =
    quoteSymbol && baseSymbol ? `${quoteSymbol} per ${baseSymbol}` : ''
  const chart = useMemo<
    { option: EChartsOption; description: string } | undefined
  >(() => {
    if (!history.data?.length) return undefined

    const points: [number, number][] = history.data.map(
      ({ timestamp, price }) => [
        timestamp * 1000,
        inverted ? 1 / price : price,
      ],
    )
    const now = Date.now()
    const hasCurrentPrice =
      currentPrice !== undefined &&
      Number.isFinite(currentPrice) &&
      currentPrice > 0
    if (hasCurrentPrice) {
      points.push([now, currentPrice])
    }

    const prices = points.map(([, price]) => price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    // Keep ECharts' numeric axis away from its rounding limit for very small quotes.
    const scale = max < 0.000001 ? max : 1
    const priceLines: MarkLineComponentOption['data'] = []
    for (const bound of [priceLower, priceUpper]) {
      if (bound !== undefined && bound >= min && bound <= max) {
        priceLines.push({ yAxis: bound / scale })
      }
    }
    if (hasCurrentPrice) {
      priceLines.push({
        name: 'Current price',
        yAxis: currentPrice / scale,
        lineStyle: {
          color: statsChartColors.v3,
          type: 'dotted',
          opacity: 1,
          width: 1.5,
        },
        label: {
          show: true,
          position: 'insideEnd',
          formatter: formatPrice(currentPrice),
          color: 'white',
          backgroundColor: statsChartColors.v3,
          borderRadius: 3,
          padding: [2, 5],
          fontSize: 11,
        },
      })
    }
    const latest = points[points.length - 1]
    const end = latest[0]
    const windowStart =
      period === 'ALL' ? points[0][0] : now - daysInPeriod[period] * 86_400_000
    const start = Math.min(end, Math.max(windowStart, points[0][0]))
    const daysShown = (end - start) / 86_400_000
    const dateFormat =
      daysShown <= 1 ? 'HH:mm' : daysShown <= 90 ? 'MMM d' : 'MMM yy'
    const textColor = resolvedTheme === 'dark' ? '#a1a1aa' : '#667085'
    const axisColor = resolvedTheme === 'dark' ? '#3f3f46' : '#e4e4e7'
    const option: EChartsOption = {
      animation: false,
      ...getStatsChartAxes({
        resolvedTheme,
        dateFormat,
        min: start,
        max: end,
      }),
      grid: { left: 2, right: 6, top: 10, bottom: 0, containLabel: true },
      yAxis: {
        type: 'value',
        position: 'right',
        scale: true,
        splitNumber: 4,
        axisLabel: {
          color: textColor,
          hideOverlap: true,
          formatter: (value: number) => formatPrice(value * scale, true),
        },
        axisLine: { show: true, lineStyle: { color: axisColor } },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      tooltip: {
        ...getStatsChartTooltip((params) => {
          const item = Array.isArray(params) ? params[0] : params
          const point = item && points[item.dataIndex]
          return point
            ? `${formatPrice(point[1])} ${units}\n${format(point[0], 'MMM d, yyyy p')}`
            : ''
        }),
        renderMode: 'richText',
        confine: true,
        padding: [6, 10],
        backgroundColor: resolvedTheme === 'dark' ? '#27272a' : '#ffffff',
        textStyle: { color: textColor, fontSize: 12 },
      },
      series: [
        {
          type: 'line',
          data: points.map(([time, price]) => [time, price / scale]),
          smooth: 0.75,
          smoothMonotone: 'x',
          showSymbol: start === end,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: { color: statsChartColors.v3 },
          lineStyle: { color: statsChartColors.v3, width: 2 },
          areaStyle: { color: statsChartColors.v3, opacity: 0.12 },
          markArea: {
            silent: true,
            itemStyle: { color: textColor, opacity: 0.06, borderWidth: 0 },
            data:
              priceLower !== undefined && priceUpper !== undefined
                ? [
                    [
                      { yAxis: priceLower / scale },
                      { yAxis: priceUpper / scale },
                    ],
                  ]
                : [],
          },
          markLine: {
            silent: true,
            // ECharts otherwise rounds marker coordinates to two decimal places.
            precision: -1,
            symbol: 'none',
            label: { show: false },
            lineStyle: {
              color: textColor,
              type: 'dashed',
              opacity: 0.4,
              width: 1,
            },
            data: priceLines,
          },
        },
      ],
    }
    return {
      option,
      description: `Prices ranged from ${formatPrice(min)} to ${formatPrice(max)} ${units}. The latest price was ${formatPrice(latest[1])} ${units}.`,
    }
  }, [
    history.data,
    currentPrice,
    inverted,
    period,
    priceLower,
    priceUpper,
    resolvedTheme,
    units,
  ])

  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-4">
      <div
        className="relative w-full aspect-[2.6] min-h-[300px]"
        aria-busy={history.isLoading}
      >
        {history.isLoading ? (
          <SkeletonChart type="area" height={300} />
        ) : chart ? (
          <div
            role="img"
            aria-label={`Pool price history${units ? ` in ${units}` : ''}, ${period === 'ALL' ? 'all time' : period}`}
            aria-description={chart.description}
            className="h-full w-full"
          >
            <ReactEchartsCore
              echarts={echarts}
              option={chart.option}
              notMerge
              style={{ height: '300px', width: '100%' }}
            />
          </div>
        ) : (
          <p
            role="status"
            className="flex h-full items-center justify-center text-sm text-muted-foreground"
          >
            {history.isError
              ? 'Price history is unavailable.'
              : 'No price history for this period.'}
          </p>
        )}
      </div>
      <ToggleGroup role="group" aria-label="Price history timeframe">
        {periods.map((value) => (
          <Toggle
            key={value}
            size="xs"
            aria-label={value === 'ALL' ? 'All Time' : undefined}
            title={value === 'ALL' ? 'All Time' : undefined}
            pressed={period === value}
            onPressedChange={() => setPeriod(value)}
          >
            {value}
          </Toggle>
        ))}
      </ToggleGroup>
    </div>
  )
}
