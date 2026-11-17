'use client'

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { Card, CardContent, Toggle, ToggleGroup } from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart } from 'echarts/charts'
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

export const VolumeChart: FC<VolumeChart> = ({ data, chainId, showBlade }) => {
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

  const onMouseOver = useCallback(
    (params: { data?: number[] }[]) => {
      if (!params[0]?.data || !params[1]?.data) return ''

      const volumeNode = document.getElementById('hoveredVolume')
      const dateNode = document.getElementById('hoveredVolumeDate')

      if (volumeNode)
        volumeNode.textContent = formatUSD(
          params[0].data[1] + params[1].data[1] + (params[2]?.data?.[1] ?? 0),
        )
      if (dateNode)
        dateNode.textContent = `${getEvmChainById(chainId).name} · ${format(new Date(params[0].data[0]), 'MMM dd, yyyy')}`

      return ''
    },
    [chainId],
  )

  const onMouseLeave = useCallback(() => {
    const volumeNode = document.getElementById('hoveredVolume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volumeNode) volumeNode.textContent = formatUSD(totalVolume)
    if (dateNode) dateNode.textContent = periodLabel
  }, [totalVolume, periodLabel])

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

  return (
    <Card>
      <CardContent className="pt-6 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">Volume</span>
              <div className="flex justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-3xl font-normal">
                    <span id="hoveredVolume">{formatUSD(totalVolume)}</span>
                  </div>
                  <div>
                    <div
                      id="hoveredVolumeDate"
                      className="text-xs text-muted-foreground whitespace-nowrap"
                    >
                      {periodLabel}
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
