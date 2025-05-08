'use client'

import { SkeletonChart, SkeletonText, Toggle } from '@sushiswap/ui'
import format from 'date-fns/format'
import * as echarts from 'echarts'
import ReactEcharts, { type EChartsOption } from 'echarts-for-react'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo, useState } from 'react'
import { useTokenPriceChart } from 'src/lib/hooks/api/useTokenPriceChart'
import type { SushiSwapChainId } from 'sushi/config'
import type { SerializedToken } from 'sushi/currency'
import { formatPercent, formatUSD } from 'sushi/format'
import type { Address } from 'sushi/types'

enum CHART_DURATION {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

interface PriceChartProps {
  token: SerializedToken
}

export const PriceChart: FC<PriceChartProps> = ({ token }) => {
  const { resolvedTheme } = useTheme()

  const [duration, setDuration] = useState<CHART_DURATION>(CHART_DURATION.DAY)

  const { data, isLoading } = useTokenPriceChart({
    chainId: token.chainId as SushiSwapChainId,
    address: token.address as Address,
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

    const transformed = data.map((d) => [d.timestamp * 1000, d.close]) as [
      number,
      number,
    ][]

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
      const priceNode = document.getElementById('hoveredPrice')
      const dateNode = document.getElementById('hoveredPriceDate')
      const diffNode = document.getElementById('hoveredPriceDiff')

      if (priceNode) priceNode.innerHTML = formatUSD(price)
      if (dateNode) {
        dateNode.innerHTML = format(new Date(timestamp), 'dd MMM yyyy HH:mm aa')
      }

      if (diffNode && firstPrice > 0) {
        const diff = price - firstPrice
        const percent = (diff / firstPrice) * 100
        const isPositive = percent >= 0
        diffNode.innerHTML = `${isPositive ? '+' : ''}${percent.toFixed(2)}%`
        diffNode.className = `ml-1 ${isPositive ? 'text-green' : 'text-red'}`
      }
    },
    [firstPrice],
  )

  const onTooltip = useCallback(
    (params: { data: [number, number] }[]) => {
      if (params[0]) {
        const [ts, price] = params[0].data
        updateDOMLabels(price, ts)
      }
    },
    [updateDOMLabels],
  )

  const onMouseLeave = useCallback(() => {
    updateDOMLabels(currentPrice, currentDate)
  }, [updateDOMLabels, currentPrice, currentDate])

  const xAxisFormatter = useCallback(
    (value: number) => {
      const d = new Date(value)
      switch (duration) {
        case CHART_DURATION.DAY:
          // e.g. “2 PM”
          return format(d, 'h a')
        case CHART_DURATION.WEEK:
        case CHART_DURATION.MONTH:
          // e.g. “Apr 21”
          return format(d, 'MMM d')
        case CHART_DURATION.YEAR:
          // e.g. “Apr 21 2025”
          return format(d, 'MMM d yyyy')
        default:
          return format(d, 'MMM d yyyy')
      }
    },
    [duration],
  )

  const chartOptions: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: onTooltip,
      },
      grid: {
        top: 10,
        left: 0,
        right: 10,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: false,
          hideOverlap: true,
          align: 'left',
          color: resolvedTheme === 'dark' ? 'white' : 'black',
          fontSize: 12,
          // interval: Math.floor(chartData.length / 5),
          padding: [0, 0, 0, 8],
          formatter: xAxisFormatter,
        },
      },
      yAxis: {
        type: 'value',
        position: 'right',
        min: yMin,
        max: yMax,
        interval: yMax && yMin ? (yMax - yMin) / 6 : undefined,
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: resolvedTheme === 'dark' ? 'white' : 'black',
          fontSize: 12,
          padding: [0, 0, 8, 0],
          formatter: (v: number) => formatUSD(v),
        },
      },
      series: [
        {
          type: 'line',
          data: chartData,
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#3B7EF6', width: 1 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59,126,246,0.5)' },
                { offset: 1, color: 'rgba(59,126,246,0)' },
              ],
            },
          },
        },
      ],
    }),
    [chartData, resolvedTheme, yMin, yMax, onTooltip, xAxisFormatter],
  )

  return isLoading ? (
    <div>
      <div className="h-14 flex flex-col gap-1">
        <div className="py-1">
          <SkeletonText className="!h-6 !w-32" />
        </div>
        <SkeletonText fontSize="sm" className="!w-12" />
      </div>
      <SkeletonChart type="area" height={300} />
    </div>
  ) : (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">
            <span id="hoveredPrice">{formatUSD(currentPrice)}</span>
          </div>
          <div className="flex text-sm">
            <span id="hoveredPriceDate" className="text-muted-foreground" />
            <span
              id="hoveredPriceDiff"
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
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Object.values(CHART_DURATION).map((d) => (
            <Toggle
              size="xs"
              pressed={d === duration}
              onClick={() => setDuration(d)}
              key={d}
            >
              {d === CHART_DURATION.DAY
                ? '1D'
                : d === CHART_DURATION.WEEK
                  ? '1W'
                  : d === CHART_DURATION.MONTH
                    ? '1M'
                    : '1Y'}
            </Toggle>
          ))}
        </div>
      </div>
      <ReactEcharts
        echarts={echarts}
        option={chartOptions}
        style={{ height: 300 }}
        onEvents={{
          globalout: onMouseLeave,
        }}
        onChartReady={(chart) => {
          setTimeout(() => {
            chart.resize()
          }, 0)
        }}
      />
    </div>
  )
}
