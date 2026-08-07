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

interface VolumeChart {
  data: AnalyticsDayBuckets
  chainId: EvmChainId
  showBlade: boolean
}

echarts.use([CanvasRenderer, BarChart, TooltipComponent, GridComponent])

export const VolumeChart: FC<VolumeChart> = ({ data, chainId, showBlade }) => {
  const { resolvedTheme } = useTheme()

  const [v2, v3, v4, blade, totalVolume] = useMemo(() => {
    const xData = (
      data.v2.length || data.v3.length
        ? data.v2.length > data.v3.length
          ? data.v2
          : data.v3
        : data.blade
    )
      .slice(0, 30)
      .map((data) => data.date * 1000)

    const v2 = xData
      .map((xData, i) => [xData, data.v2[i]?.volumeUSD ?? 0])
      .reverse()
    const v3 = xData
      .map((xData, i) => [xData, data.v3[i]?.volumeUSD ?? 0])
      .reverse()
    const v4: [number, number][] = []
    const blade = xData
      .map((xData, i) => [xData, data.blade[i]?.volumeUSD ?? 0])
      .reverse()
    const totalVolume = xData.reduce(
      (sum, _, i) =>
        sum + v2[i][1] + v3[i][1] + (v4[i]?.[1] ?? 0) + blade[i][1],
      0,
    )

    return [v2, v3, v4, blade, totalVolume]
  }, [data])

  const onMouseOver = useCallback(
    (params: { data?: number[]; seriesName?: string }[]) => {
      const v2Data = params.find(({ seriesName }) => seriesName === 'v2')?.data
      const v3Data = params.find(({ seriesName }) => seriesName === 'v3')?.data
      const v4Data = params.find(({ seriesName }) => seriesName === 'v4')?.data
      const bladeData = params.find(
        ({ seriesName }) => seriesName === 'blade',
      )?.data

      if (!v2Data || !v3Data) return ''

      const volumeNode = document.getElementById('hoveredVolume')
      const v2VolumeNode = document.getElementById('hoveredV2Volume')
      const v3VolumeNode = document.getElementById('hoveredV3Volume')
      const v4VolumeNode = document.getElementById('hoveredV4Volume')
      const bladeVolumeNode = document.getElementById('hoveredBladeVolume')
      const dateNode = document.getElementById('hoveredVolumeDate')

      if (volumeNode)
        volumeNode.innerHTML = formatUSD(
          v2Data[1] + v3Data[1] + (v4Data?.[1] ?? 0) + (bladeData?.[1] ?? 0),
        )
      if (dateNode)
        dateNode.innerHTML = format(
          new Date(v2Data[0]),
          "dd MMM yyyy'<br>'hh:mm aa",
        )
      if (v2VolumeNode)
        v2VolumeNode.innerHTML = v2Data[1] ? formatUSD(v2Data[1]) : ''
      if (v3VolumeNode)
        v3VolumeNode.innerHTML = v3Data[1] ? formatUSD(v3Data[1]) : ''
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
        {
          name: 'v4',
          type: 'bar',
          stack: 'a',
          data: v4,
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
    }),
    [onMouseOver, resolvedTheme, v2, v3, v4, blade, showBlade],
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
            <div className="flex justify-between items-center gap-2 text-sm">
              <span id="hoveredV4Volume" />
              <span className="flex gap-1 items-center">
                <span className="font-medium">v4</span>
                <span className="bg-[#FA52A0] rounded-[4px] w-3 h-3" />
              </span>
            </div>
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
