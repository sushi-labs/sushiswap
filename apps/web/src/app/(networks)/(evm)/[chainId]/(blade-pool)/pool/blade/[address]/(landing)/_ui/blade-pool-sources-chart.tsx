'use client'

import { Card, SkeletonBox } from '@sushiswap/ui'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { usePoolTransactionSourcesData } from 'src/lib/pool/blade/usePoolTransactionSourcesData'
import { formatPercent, formatUSD } from 'sushi'
import type { BladeChainId } from 'sushi/evm'
import type { Address } from 'viem'
import {
  PoolChartPeriod,
  PoolChartPeriods,
} from '~evm/[chainId]/pool/_ui/pool-chart-periods'
import { PoolChartTypes } from '~evm/[chainId]/pool/_ui/pool-chart-types'
import { BLADE_POOL_CHART_COLORS } from './constants'

echarts.use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const WHITELISTED_SOURCES = [
  'clipper',
  '1inch',
  'openocean',
  'odos.xyz',
  'okx',
  'barter',
]

export enum BladeSourcesChartType {
  Volume = 'Source Volume',
  Transactions = 'Source Transactions',
}

const sourcesChartTypes = [
  BladeSourcesChartType.Volume,
  BladeSourcesChartType.Transactions,
]

interface BladePoolSourcesChartProps {
  poolAddress: Address
  chainId: BladeChainId
}

export function BladePoolSourcesChart({
  poolAddress,
  chainId,
}: BladePoolSourcesChartProps) {
  const { resolvedTheme } = useTheme()
  const [chartType, setChartType] = useState<BladeSourcesChartType>(
    BladeSourcesChartType.Volume,
  )
  const [period, setPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Day)

  const duration = useMemo(() => {
    switch (period) {
      case PoolChartPeriod.Day:
        return 'DAY'
      case PoolChartPeriod.Week:
        return 'WEEK'
      case PoolChartPeriod.Month:
        return 'MONTH'
      case PoolChartPeriod.All:
        return 'ALL'
      default:
        return 'DAY'
    }
  }, [period])

  const periods = useMemo(
    () => [
      PoolChartPeriod.Day,
      PoolChartPeriod.Week,
      PoolChartPeriod.Month,
      PoolChartPeriod.All,
    ],
    [],
  )

  const { data, isLoading } = usePoolTransactionSourcesData({
    poolAddress,
    chainId,
    duration,
  })

  const groupedSources: {
    [key: string]: { volume: number; transactions: number }
  } = useMemo(() => {
    if (!data || data.length === 0) return {}

    return data.reduce(
      (
        prev: Record<string, { volume: number; transactions: number }>,
        curr,
      ) => {
        const sourceName = curr.source.toLowerCase()
        const volumeUSD = curr.volumeUSD || 0
        const transactionCount = curr.txCount || 0

        if (sourceName.includes('clipper')) {
          if (!prev.Blade) prev.Blade = { volume: 0, transactions: 0 }
          prev.Blade.volume += volumeUSD
          prev.Blade.transactions += transactionCount
          return prev
        }

        const whitelistedSource = WHITELISTED_SOURCES.find((source) =>
          sourceName.includes(source.toLowerCase()),
        )

        if (whitelistedSource) {
          const displayName =
            whitelistedSource.charAt(0).toUpperCase() +
            whitelistedSource.slice(1)
          if (!prev[displayName])
            prev[displayName] = { volume: 0, transactions: 0 }
          prev[displayName].volume += volumeUSD
          prev[displayName].transactions += transactionCount
          return prev
        }

        if (!prev.Other) prev.Other = { volume: 0, transactions: 0 }
        prev.Other.volume += volumeUSD
        prev.Other.transactions += transactionCount
        return prev
      },
      {},
    )
  }, [data])

  const chartData = useMemo(() => {
    const getValue = (source: string) => {
      return chartType === BladeSourcesChartType.Volume
        ? groupedSources[source]?.volume || 0
        : groupedSources[source]?.transactions || 0
    }

    return Object.keys(groupedSources).map((source, index) => ({
      value: getValue(source),
      name: source,
      itemStyle: {
        color: BLADE_POOL_CHART_COLORS[index % BLADE_POOL_CHART_COLORS.length],
      },
    }))
  }, [groupedSources, chartType])

  const hasData = useMemo(() => {
    return chartData.length > 0 && chartData.some((item) => item.value > 0)
  }, [chartData])

  const option = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'item',
        backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#ffffff',
        borderColor: resolvedTheme === 'dark' ? '#334155' : '#e2e8f0',
        textStyle: {
          color: resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a',
        },
        formatter: (params: any) => {
          const isVolume = chartType === BladeSourcesChartType.Volume
          return `
            <div>
              <div>${params.name}</div>
              <div>${isVolume ? formatUSD(params.value) : `${params.value} txns`}</div>
              <div style="font-size: 12px; color: #64748b;">
                ${formatPercent(params.percent / 100)}
              </div>
            </div>
          `
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '90%'],
          data: chartData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }),
    [chartData, resolvedTheme, chartType],
  )

  if (isLoading) {
    return (
      <Card className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-accent border-b px-6 py-4">
          <PoolChartTypes
            charts={sourcesChartTypes}
            selectedChart={chartType}
            setChart={setChartType}
          />
          <PoolChartPeriods
            periods={periods}
            selectedPeriod={period}
            setPeriod={setPeriod}
          />
        </div>
        <div className="p-6">
          <SkeletonBox className="h-[280px] w-full" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 border-accent border-b px-6 py-4">
        <PoolChartTypes
          charts={sourcesChartTypes}
          selectedChart={chartType}
          setChart={setChartType}
        />
        <PoolChartPeriods
          periods={periods}
          selectedPeriod={period}
          setPeriod={setPeriod}
        />
      </div>
      <div className="flex flex-col gap-6 p-6">
        {!hasData ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-2 font-medium text-lg text-muted-foreground">
                No data available
              </div>
              <div className="text-sm text-muted-foreground">
                No {chartType.toLowerCase()} data found for the selected period
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-around">
            <div className="h-[400px] w-full flex-shrink-0 lg:w-[320px]">
              <ReactEchartsCore
                echarts={echarts}
                option={option}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
            <div className="lg:pt-8">
              <div className="flex flex-wrap justify-center gap-3 lg:flex-col lg:justify-start lg:space-y-0">
                {chartData.map((source, index) => (
                  <div key={source.name} className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 flex-shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          BLADE_POOL_CHART_COLORS[
                            index % BLADE_POOL_CHART_COLORS.length
                          ],
                      }}
                    />
                    <span className="font-medium text-black text-sm dark:text-white">
                      {source.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
