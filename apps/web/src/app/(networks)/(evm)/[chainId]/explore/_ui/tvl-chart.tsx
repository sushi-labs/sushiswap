'use client'

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Card, CardContent, Toggle, ToggleGroup } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo, useState } from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import {
  TIMEFRAME_OPTIONS,
  type TimeframeOption,
  timeframeToMs,
} from './global-stats-charts'

interface TVLChart {
  data: AnalyticsDayBuckets
  chainId: EvmChainId
  showBlade: boolean
}

echarts.use([CanvasRenderer, LineChart, TooltipComponent, GridComponent])

export const TVLChart: FC<TVLChart> = ({ data, chainId, showBlade }) => {
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

  const onMouseOver = useCallback(
    (params: { data?: number[] }[]) => {
      if (!params[0].data || !params[1].data) return ''

      const tvlNode = document.getElementById('hoveredTVL')
      const dateNode = document.getElementById('hoveredTVLDate')

      if (tvlNode)
        tvlNode.innerHTML = formatUSD(
          params[0].data[1] + params[1].data[1] + (params[2]?.data?.[1] ?? 0),
        )
      if (dateNode)
        dateNode.innerHTML = `${getEvmChainById(chainId).name} · ${format(new Date(params[0].data[0]), 'MMM dd, yyyy')}`

      return ''
    },
    [chainId],
  )

  const onMouseLeave = useCallback(() => {
    const tvlNode = document.getElementById('hoveredTVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode) tvlNode.innerHTML = formatUSD(combinedTVL)
    if (dateNode)
      dateNode.innerHTML = `${getEvmChainById(chainId).name} · ${format(new Date(currentDate), 'MMM dd, yyyy')}`
  }, [combinedTVL, currentDate, chainId])

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
          min: v2[0]?.[0],
          max: currentDate,
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
            color: textColor,
            margin: 16,
            formatter: (value: number) =>
              value === 0 ? '0' : formatUSD(value),
          },
          splitLine: {
            lineStyle: { color: isLight ? '#e3e3e3' : '#3b3b3b' },
          },
        },
      ],
      series: [
        {
          name: 'v2',
          type: 'line',
          stack: 'v2',
          smooth: true,
          lineStyle: {
            color: '#A0A0A0',
            width: 2,
          },
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#A0A0A040' },
              { offset: 1, color: '#A0A0A000' },
            ]),
          },
          data: v2,
          z: zIndex.v2,
        },
        {
          name: 'v3',
          type: 'line',
          stack: 'v3',
          smooth: true,
          lineStyle: {
            color: '#FA52A0',
            width: 2,
          },
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#FA52A040' },
              { offset: 1, color: '#FA52A000' },
            ]),
          },
          data: v3,
          z: zIndex.v3,
        },
        ...(showBlade
          ? [
              {
                name: 'blade',
                type: 'line',
                stack: 'blade',
                smooth: true,
                lineStyle: {
                  color: '#F23BF6',
                  width: 2,
                },
                showSymbol: false,
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#F23BF640' },
                    { offset: 1, color: '#F23BF600' },
                  ]),
                },
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

  return (
    <Card>
      <CardContent className="pt-6 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">
                Total value locked
              </span>
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-normal">
                    <span id="hoveredTVL">{formatUSD(combinedTVL)}</span>
                  </div>
                  <div>
                    <div
                      id="hoveredTVLDate"
                      className="text-xs text-muted-foreground whitespace-nowrap"
                    >
                      {isMounted && currentDate
                        ? `${getEvmChainById(chainId).name} · ${format(new Date(currentDate), 'MMM dd, yyyy')}`
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ToggleGroup className="h-fit">
              {TIMEFRAME_OPTIONS.map((time) => (
                <Toggle
                  key={time}
                  onClick={() => setTimeframe(time)}
                  pressed={timeframe === time}
                  size="xs"
                >
                  {time}
                </Toggle>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-row text-muted-foreground gap-1 self-end">
            <div className="flex justify-between items-center gap-2 text-xs">
              <span className="flex gap-1 items-center">
                <span className="bg-[#A0A0A0] rounded-full w-2 h-2" />
                <span className="font-medium">V2</span>
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-xs">
              <span className="flex gap-1 items-center">
                <span className="bg-[#FA52A0] rounded-full w-2 h-2" />
                <span className="font-medium">V3</span>
              </span>
            </div>
            {showBlade && (
              <div className="flex justify-between items-center gap-2 text-xs">
                <span className="flex gap-1 items-center">
                  <span className="bg-[#F23BF6] rounded-full w-2 h-2" />
                  <span className="font-medium">Blade</span>
                </span>
              </div>
            )}
          </div>
        </div>
        <ReactEchartsCore
          option={DEFAULT_OPTION}
          echarts={echarts}
          style={{ height: 200 }}
          onEvents={{
            globalout: onMouseLeave,
          }}
        />
      </CardContent>
    </Card>
  )
}
