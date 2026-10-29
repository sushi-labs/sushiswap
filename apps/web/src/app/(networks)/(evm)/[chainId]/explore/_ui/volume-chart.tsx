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
import { type FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'
import { alignDayBuckets } from './align-day-buckets'

interface VolumeChart {
  data: AnalyticsDayBuckets
  chainId: EvmChainId
  showBlade: boolean
  showV4: boolean
}

echarts.use([CanvasRenderer, BarChart, TooltipComponent, GridComponent])

export const VolumeChart: FC<VolumeChart> = ({
  data,
  chainId,
  showBlade,
  showV4,
}) => {
  const { resolvedTheme } = useTheme()

  const [v2, v3, v4, blade, totalVolume] = useMemo(() => {
    const { v2, v3, v4, blade } = alignDayBuckets(data, 'volumeUSD', 30)
    const totalVolume = [...v2, ...v3, ...v4, ...blade].reduce(
      (sum, [_, value]) => sum + value,
      0,
    )

    return [v2, v3, v4, blade, totalVolume]
  }, [data])

  const onMouseOver = useCallback(
    (params: { data?: number[]; seriesName?: string }[]) => {
      if (!params[0]?.data || !params[1]?.data) return ''

      const v4Data = params.find((param) => param.seriesName === 'v4')?.data
      const bladeData = params.find(
        (param) => param.seriesName === 'blade',
      )?.data

      const volumeNode = document.getElementById('hoveredVolume')
      const v2VolumeNode = document.getElementById('hoveredV2Volume')
      const v3VolumeNode = document.getElementById('hoveredV3Volume')
      const v4VolumeNode = document.getElementById('hoveredV4Volume')
      const bladeVolumeNode = document.getElementById('hoveredBladeVolume')
      const dateNode = document.getElementById('hoveredVolumeDate')

      if (volumeNode)
        volumeNode.innerHTML = formatUSD(
          params.reduce((sum, param) => sum + (param.data?.[1] ?? 0), 0),
        )
      if (dateNode)
        dateNode.innerHTML = format(
          new Date(params[0].data[0]),
          "dd MMM yyyy'<br>'hh:mm aa",
        )
      if (v2VolumeNode)
        v2VolumeNode.innerHTML = params[0].data[1]
          ? formatUSD(params[0].data[1])
          : ''
      if (v3VolumeNode)
        v3VolumeNode.innerHTML = params[1].data[1]
          ? formatUSD(params[1].data[1])
          : ''
      if (v4VolumeNode)
        v4VolumeNode.innerHTML = v4Data?.[1] ? formatUSD(v4Data[1]) : ''
      if (bladeVolumeNode)
        bladeVolumeNode.innerHTML = bladeData?.[1]
          ? formatUSD(bladeData[1])
          : ''

      return ''
    },
    [],
  )

  const onMouseLeave = useCallback(() => {
    const volumeNode = document.getElementById('hoveredVolume')
    const v2VolumeNode = document.getElementById('hoveredV2Volume')
    const v3VolumeNode = document.getElementById('hoveredV3Volume')
    const v4VolumeNode = document.getElementById('hoveredV4Volume')
    const bladeVolumeNode = document.getElementById('hoveredBladeVolume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volumeNode) volumeNode.innerHTML = formatUSD(totalVolume)
    if (dateNode) dateNode.innerHTML = 'Past month'
    if (v2VolumeNode) v2VolumeNode.innerHTML = ''
    if (v3VolumeNode) v3VolumeNode.innerHTML = ''
    if (v4VolumeNode) v4VolumeNode.innerHTML = ''
    if (bladeVolumeNode) bladeVolumeNode.innerHTML = ''
  }, [totalVolume])

  const DEFAULT_OPTION = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        padding: 0,
        borderWidth: 0,
        axisPointer: {
          lineStyle: {
            type: 'solid',
          },
        },
        formatter: (params) =>
          onMouseOver(Array.isArray(params) ? params : [params]),
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 40,
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
          splitNumber: 2,
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
            color: resolvedTheme === 'dark' ? 'white' : 'black',
            formatter: (value: number, index: number) => {
              const label = format(new Date(value), 'MMM d')
              return index === 0
                ? `{min|${label}}`
                : value > v2?.[v2.length - 2]?.[0]
                  ? `{max|${label}}`
                  : label
            },
            rich: {
              min: {
                padding: [0, 10, 0, 50],
              },
              max: {
                padding: [0, 50, 0, 10],
              },
            },
          },
        },
      ],
      yAxis: [
        {
          show: false,
        },
      ],
      series: [
        {
          name: 'v2',
          type: 'bar',
          stack: 'a',
          data: v2,
          itemStyle: { color: '#3B7EF6', barBorderRadius: [0, 0, 2, 2] },
        },
        {
          name: 'v3',
          type: 'bar',
          stack: 'a',
          data: v3,
          itemStyle: { color: '#A755DD', barBorderRadius: [2, 2, 0, 0] },
        },
        ...(showV4
          ? [
              {
                name: 'v4',
                type: 'bar',
                stack: 'a',
                data: v4,
                itemStyle: { color: '#22C55E', barBorderRadius: [2, 2, 0, 0] },
              },
            ]
          : []),
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
    }),
    [onMouseOver, resolvedTheme, v2, v3, v4, blade, showBlade, showV4],
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-sm">
          {getEvmChainById(chainId).name} Volume
        </span>
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium">
              <span id="hoveredVolume">{formatUSD(totalVolume)}</span>
            </div>
            <div>
              <div
                id="hoveredVolumeDate"
                className="text-sm text-gray-500 dark:text-slate-500 min-h-[40px]"
              >
                Past month
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-2 text-sm">
              <span id="hoveredV2Volume" />
              <span className="flex gap-1 items-center">
                <span className="font-medium">v2</span>
                <span className="bg-[#3B7EF6] rounded-[4px] w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-sm">
              <span id="hoveredV3Volume" />
              <span className="flex gap-1 items-center">
                <span className="font-medium">v3</span>
                <span className="bg-[#A755DD] rounded-[4px] w-3 h-3" />
              </span>
            </div>
            {showV4 && (
              <div className="flex justify-between items-center gap-2 text-sm">
                <span id="hoveredV4Volume" />
                <span className="flex gap-1 items-center">
                  <span className="font-medium">v4</span>
                  <span className="bg-[#22C55E] rounded-[4px] w-3 h-3" />
                </span>
              </div>
            )}
            {showBlade && (
              <div className="flex justify-between items-center gap-2 text-sm">
                <span id="hoveredBladeVolume" />
                <span className="flex gap-1 items-center">
                  <span className="font-medium">blade</span>
                  <span className="bg-[#F23BF6] rounded-[4px] w-3 h-3" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ReactEchartsCore
        option={DEFAULT_OPTION}
        echarts={echarts}
        style={{ height: 400 }}
        onEvents={{
          globalout: onMouseLeave,
        }}
      />
    </div>
  )
}
