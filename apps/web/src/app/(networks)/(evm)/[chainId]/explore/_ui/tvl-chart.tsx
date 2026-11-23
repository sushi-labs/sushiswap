'use client'

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import format from 'date-fns/format'
import type { EChartsOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import {
  getStatsChartAxes,
  getStatsChartTooltip,
  getStatsLineStyle,
  statsChartColors,
} from '../../_ui/stats-chart-options'
import {
  GlobalStatsChartCard,
  type GlobalStatsChartCardProps,
} from './global-stats-chart-card'
import { type TimeframeOption, timeframeToMs } from './global-stats-charts'
import { useChartHover } from './use-chart-hover'

interface TVLChart {
  data: AnalyticsDayBuckets
  chainId: EvmChainId
  showBlade: boolean
}

echarts.use([CanvasRenderer, LineChart, TooltipComponent, GridComponent])

export function useTVLChart({
  data,
  chainId,
  showBlade,
}: TVLChart): GlobalStatsChartCardProps {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('All')

  const isMounted = useIsMounted()

  const { resolvedTheme } = useTheme()

  const [v2, v3, blade, combinedTVL, currentDate] = useMemo(() => {
    const xData = (
      data.v2.length || data.v3.length
        ? data.v2.length > data.v3.length
          ? data.v2
          : data.v3
        : data.blade
    )
      .map((data) => data.date * 1000)
      .filter((date) => Date.now() - date <= timeframeToMs[timeframe])

    const v2 = xData
      .map((xData, i) => [xData, data.v2[i]?.liquidityUSD ?? 0])
      .reverse()
    const v3 = xData
      .map((xData, i) => [xData, data.v3[i]?.liquidityUSD ?? 0])
      .reverse()
    const blade = xData
      .map((xData, i) => [xData, data.blade[i]?.liquidityUSD ?? 0])
      .reverse()

    const v2TVL = v2[v2.length - 1]?.[1] ?? 0
    const v3TVL = v3[v3.length - 1]?.[1] ?? 0
    const bladeTVL = blade[blade.length - 1]?.[1] ?? 0
    const combinedTVL = v2TVL + v3TVL + bladeTVL

    const currentDate = xData[0]

    return [v2, v3, blade, combinedTVL, currentDate]
  }, [data, timeframe])

  const zIndex = useMemo(() => {
    const v2Sum = v2.reduce((sum, [_, value]) => sum + value, 0)
    const v3Sum = v3.reduce((sum, [_, value]) => sum + value, 0)

    if (v2Sum < v3Sum) {
      return { v2: 2, v3: 1 }
    } else {
      return { v2: 1, v3: 2 }
    }
  }, [v2, v3])

  const { value, label, onMouseOver, onMouseLeave } = useChartHover({
    value: combinedTVL,
    label:
      isMounted && currentDate
        ? `${getEvmChainById(chainId).name} · ${format(new Date(currentDate), 'MMM dd, yyyy')}`
        : '',
    chainId,
    timeframe,
  })

  const DEFAULT_OPTION = useMemo<EChartsOption>(() => {
    return {
      animation: false,
      tooltip: getStatsChartTooltip(onMouseOver),
      color: Object.values(statsChartColors),
      ...getStatsChartAxes({
        resolvedTheme,
        min: v2[0]?.[0],
        max: currentDate,
      }),
      series: [
        {
          name: 'v2',
          type: 'line',
          stack: 'v2',
          ...getStatsLineStyle(statsChartColors.v2),
          data: v2,
          z: zIndex.v2,
        },
        {
          name: 'v3',
          type: 'line',
          stack: 'v3',
          ...getStatsLineStyle(statsChartColors.v3),
          data: v3,
          z: zIndex.v3,
        },
        ...(showBlade
          ? [
              {
                name: 'blade',
                type: 'line' as const,
                stack: 'blade',
                ...getStatsLineStyle(statsChartColors.blade),
                data: blade,
                z: 3,
              },
            ]
          : []),
      ],
    }
  }, [
    onMouseOver,
    v2,
    v3,
    blade,
    zIndex,
    resolvedTheme,
    showBlade,
    currentDate,
  ])

  return {
    title: 'Total value locked',
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

export function TVLChart(props: TVLChart): React.ReactElement {
  return <GlobalStatsChartCard {...useTVLChart(props)} />
}
