'use client'

import { SkeletonChart, SkeletonText } from '@sushiswap/ui'
import format from 'date-fns/format'
import ReactEcharts, { type EChartsOption } from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { useTokenPriceChart } from 'src/lib/hooks/api/useTokenPriceChart'
import type { SushiSwapChainId } from 'sushi/config'
import type { Token } from 'sushi/currency'
import { formatPercent, formatUSD } from 'sushi/format'

interface PriceChartProps {
  token: Token
}

export const PriceChart: FC<PriceChartProps> = ({ token }) => {
  const { resolvedTheme } = useTheme()

  const { data, isLoading } = useTokenPriceChart({
    chainId: token.chainId as SushiSwapChainId,
    address: token.address,
    duration: 'DAY',
  })

  const [
    chartData,
    currentPrice,
    currentDate,
    firstPrice,
    yMin,
    yMax,
    priceChange,
  ] = useMemo(() => {
    if (!data || data.length === 0)
      return [[], 0, 0, 0, undefined, undefined, 0]

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

    return [transformed, current, latest?.[0] ?? 0, initial, yMin, yMax, change]
  }, [data])

  const onMouseOver = useCallback(
    (params: { data: number[] }[]) => {
      const price = params?.[0]?.data?.[1]
      const timestamp = params?.[0]?.data?.[0]

      const priceNode = document.getElementById('hoveredPrice')
      const dateNode = document.getElementById('hoveredPriceDate')
      const diffNode = document.getElementById('hoveredPriceDiff')

      if (priceNode) priceNode.innerHTML = formatUSD(price)
      if (dateNode && timestamp) {
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

  const onMouseLeave = useCallback(() => {
    const priceNode = document.getElementById('hoveredPrice')
    const dateNode = document.getElementById('hoveredPriceDate')
    const diffNode = document.getElementById('hoveredPriceDiff')

    if (priceNode) priceNode.innerHTML = formatUSD(currentPrice)
    if (dateNode) {
      dateNode.innerHTML = format(new Date(currentDate), 'dd MMM yyyy HH:mm aa')
    }

    if (diffNode && firstPrice > 0) {
      const diff = currentPrice - firstPrice
      const percent = (diff / firstPrice) * 100
      const isPositive = percent >= 0
      diffNode.innerHTML = `${isPositive ? '+' : ''}${percent.toFixed(2)}%`
      diffNode.className = `ml-1 ${isPositive ? 'text-green' : 'text-red'}`
    }
  }, [currentPrice, currentDate, firstPrice])

  const chartOptions: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: onMouseOver,
      },
      grid: {
        top: 10,
        left: 0,
      },
      xAxis: [
        {
          type: 'time',
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
            color: resolvedTheme === 'dark' ? 'white' : 'black',
            formatter: (value: number, index: number) => {
              const date = new Date(value)
              const label = `${date.toLocaleString('en-US', {
                month: 'short',
              })} ${date.getDate()}\n${date.getFullYear()}`
              return index === 0
                ? `{min|${label}}`
                : value > chartData?.[chartData.length - 2]?.[0]
                  ? `{max|${label}}`
                  : label
            },
            padding: [0, 10, 0, 10],
            rich: {
              min: { padding: [0, 10, 0, 50] },
              max: { padding: [0, 50, 0, 10] },
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          position: 'right',
          min: yMin,
          max: yMax,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: {
            color: resolvedTheme === 'dark' ? 'white' : 'black',
            formatter: (value: number) => {
              return formatUSD(value)
            },
          },
        },
      ],
      series: [
        {
          name: 'Price',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 0 },
          areaStyle: {
            color: '#3B7EF6',
            opacity: 1,
          },
          data: chartData,
          z: 1,
        },
      ],
    }
  }, [onMouseOver, chartData, resolvedTheme, yMin, yMax])

  return isLoading ? (
    <div>
      <div className="flex flex-col gap-1">
        <div className="py-1">
          <SkeletonText className="!h-6 !w-32" />
        </div>
        <SkeletonText fontSize="sm" className="!w-12" />
      </div>
      <SkeletonChart type="area" height={300} />
    </div>
  ) : (
    <div>
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
      <ReactEcharts
        option={chartOptions}
        echarts={echarts}
        style={{ height: 300 }}
        onEvents={{ globalout: onMouseLeave }}
      />
    </div>
  )
}
