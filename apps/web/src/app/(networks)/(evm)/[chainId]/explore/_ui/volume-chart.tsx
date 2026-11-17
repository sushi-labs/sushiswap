'use client'

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import {
  GlobalStatsChartCard,
  type GlobalStatsChartCardProps,
} from './global-stats-chart-card'
import { type TimeframeOption, timeframeToMs } from './global-stats-charts'
import { useChartHover } from './use-chart-hover'

interface VolumeChart {
  data: AnalyticsDayBuckets
  chainId: EvmChainId
  showBlade: boolean
}

echarts.use([CanvasRenderer, BarChart, TooltipComponent, GridComponent])

const TIMEFRAME_LABELS: Record<TimeframeOption, string> = {
  '1W': 'Past week',
  '1M': 'Past month',
  '3M': 'Past 3 months',
  All: 'Available history',
}

export function useVolumeChart({
  data,
  chainId,
  showBlade,
}: VolumeChart): GlobalStatsChartCardProps {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('1M')
  const { resolvedTheme } = useTheme()
  const periodLabel = `${getEvmChainById(chainId).name} · ${TIMEFRAME_LABELS[timeframe]}`

  const [v2, v3, blade, totalVolume] = useMemo(() => {
    const now = Date.now()
    const xData = (
      data.v2.length || data.v3.length
        ? data.v2.length > data.v3.length
          ? data.v2
          : data.v3
        : data.blade
    )
      .map((data, index) => ({ date: data.date * 1000, index }))
      .filter(({ date }) => now - date <= timeframeToMs[timeframe])

    const v2 = xData
      .map(({ date, index }) => [date, data.v2[index]?.volumeUSD ?? 0])
      .reverse()
    const v3 = xData
      .map(({ date, index }) => [date, data.v3[index]?.volumeUSD ?? 0])
      .reverse()
    const blade = xData
      .map(({ date, index }) => [date, data.blade[index]?.volumeUSD ?? 0])
      .reverse()
    const totalVolume = xData.reduce(
      (sum, _, i) => sum + v2[i][1] + v3[i][1] + blade[i][1],
      0,
    )

    return [v2, v3, blade, totalVolume]
  }, [data, timeframe])

  const { value, label, onMouseOver, onMouseLeave } = useChartHover({
    value: totalVolume,
    label: periodLabel,
    chainId,
    timeframe,
  })

  const DEFAULT_OPTION = useMemo<EChartOption>(() => {
    const isLight = resolvedTheme === 'light'
    const textColor = '#A0A0A0'

    return {
      animation: false,
      tooltip: {
        trigger: 'axis',
        padding: 0,
        borderWidth: 0,
        axisPointer: {
          lineStyle: {
            type: 'dashed',
            color: textColor,
          },
        },
        formatter: (params) =>
          onMouseOver(Array.isArray(params) ? params : [params]),
      },
      color: ['#A0A0A0', '#FA52A0', '#F23BF6'],
      grid: {
        top: 24,
        left: 0,
        right: 0,
        bottom: 0,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'time',
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitNumber: 3,
          axisLabel: {
            hideOverlap: true,
            color: textColor,
            margin: 16,
            formatter: (value: number) => format(new Date(value), 'd MMM'),
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          splitNumber: 3,
          axisLabel: {
            show: false,
          },
          splitLine: {
            lineStyle: { color: isLight ? '#e3e3e3' : '#3b3b3b' },
          },
        },
      ],
      series: [
        {
          name: 'v2',
          type: 'bar',
          stack: 'a',
          data: v2,
          itemStyle: { color: '#A0A0A0', barBorderRadius: [0, 0, 2, 2] },
        },
        {
          name: 'v3',
          type: 'bar',
          stack: 'a',
          data: v3,
          itemStyle: { color: '#FA52A0', barBorderRadius: [2, 2, 0, 0] },
        },
        ...(showBlade
          ? [
              {
                name: 'blade',
                type: 'bar',
                stack: 'a',
                data: blade,
                itemStyle: { color: '#F23BF6', barBorderRadius: [2, 2, 0, 0] },
              },
            ]
          : []),
      ],
    }
  }, [onMouseOver, resolvedTheme, v2, v3, blade, showBlade])

  return {
    title: 'Trading volume',
    timeframe,
    onTimeframeChange: setTimeframe,
    showBlade,
    onDeselect: onMouseLeave,
    summary: (
      <>
        <span className="text-2xl sm:text-3xl text-primary">
          {formatUSD(value)}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </>
    ),
    children: (
      <ReactEchartsCore
        option={DEFAULT_OPTION}
        echarts={echarts}
        style={{ height: 200 }}
        onEvents={{
          globalout: onMouseLeave,
        }}
      />
    ),
  }
}

export function VolumeChart(props: VolumeChart): React.ReactElement {
  return <GlobalStatsChartCard {...useVolumeChart(props)} />
}
