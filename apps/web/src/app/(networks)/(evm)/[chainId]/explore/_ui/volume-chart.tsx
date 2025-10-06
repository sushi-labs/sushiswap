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
}

echarts.use([CanvasRenderer, BarChart, TooltipComponent, GridComponent])

export const VolumeChart: FC<VolumeChart> = ({ data, chainId }) => {
  const { resolvedTheme } = useTheme()

  const [v2, v3, totalVolume] = useMemo(() => {
    const xData = (data.v2.length > data.v3.length ? data.v2 : data.v3)
      .slice(0, 30)
      .map((data) => data.date * 1000)

    const v2 = xData
      .map((xData, i) => [xData, data.v2[i]?.volumeUSD ?? 0])
      .reverse()
    const v3 = xData
      .map((xData, i) => [xData, data.v3[i]?.volumeUSD ?? 0])
      .reverse()
    const totalVolume = xData.reduce(
      (sum, _, i) => sum + v2[i][1] + v3[i][1],
      0,
    )

    return [v2, v3, totalVolume]
  }, [data])

  const onMouseOver = useCallback((params: { data?: number[] }[]) => {
    if (!params[0].data || !params[1].data) return ''

    const volumeNode = document.getElementById('hoveredVolume')
    const v2VolumeNode = document.getElementById('hoveredV2Volume')
    const v3VolumeNode = document.getElementById('hoveredV3Volume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volumeNode)
      volumeNode.innerHTML = formatUSD(params[0].data[1] + params[1].data[1])
    if (dateNode)
      dateNode.innerHTML = format(
        new Date(params[0].data[0]),
        'dd MMM yyyy HH:mm aa',
      )
    if (v2VolumeNode)
      v2VolumeNode.innerHTML = params[0].data[1]
        ? formatUSD(params[0].data[1])
        : ''
    if (v3VolumeNode)
      v3VolumeNode.innerHTML = params[1].data[1]
        ? formatUSD(params[1].data[1])
        : ''

    return ''
  }, [])

  const onMouseLeave = useCallback(() => {
    const volumeNode = document.getElementById('hoveredVolume')
    const v2VolumeNode = document.getElementById('hoveredV2Volume')
    const v3VolumeNode = document.getElementById('hoveredV3Volume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volumeNode) volumeNode.innerHTML = formatUSD(totalVolume)
    if (dateNode) dateNode.innerHTML = 'Past month'
    if (v2VolumeNode) v2VolumeNode.innerHTML = ''
    if (v3VolumeNode) v3VolumeNode.innerHTML = ''
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
      ],
    }),
    [onMouseOver, resolvedTheme, v2, v3],
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
                className="text-sm text-gray-500 dark:text-slate-500"
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
