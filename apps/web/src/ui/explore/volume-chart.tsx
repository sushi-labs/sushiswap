'use client'

import { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import format from 'date-fns/format'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi/format'

export const VolumeChart: FC<{ data: AnalyticsDayBuckets }> = ({ data }) => {
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

  const onMouseOver = useCallback((params: { data: number[] }[]) => {
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
        : 'v2'
    if (v3VolumeNode)
      v3VolumeNode.innerHTML = params[1].data[1]
        ? formatUSD(params[1].data[1])
        : 'v3'
  }, [])

  const onMouseLeave = useCallback(() => {
    const volumeNode = document.getElementById('hoveredVolume')
    const v2VolumeNode = document.getElementById('hoveredV2Volume')
    const v3VolumeNode = document.getElementById('hoveredV3Volume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volumeNode) volumeNode.innerHTML = formatUSD(totalVolume)
    if (dateNode) dateNode.innerHTML = 'Past month'
    if (v2VolumeNode) v2VolumeNode.innerHTML = 'v2'
    if (v3VolumeNode) v3VolumeNode.innerHTML = 'v3'
  }, [totalVolume])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: onMouseOver,
      },
      grid: {
        left: '0',
        right: '0',
        top: '0',
      },
      xAxis: [
        {
          type: 'time',
          boundaryGap: true,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            showMaxLabel: false,
            showMinLabel: false,
            color: resolvedTheme === 'dark' ? 'white' : 'black',
            formatter: (value: number) => format(new Date(value), 'MMM d'),
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
        <span className="text-muted-foreground text-sm">Volume</span>
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
            <div className="flex justify-end items-center gap-1">
              <span id="hoveredV2Volume" className="text-sm">
                v2
              </span>
              <span className="bg-[#3B7EF6] rounded-[4px] w-3 h-3" />
            </div>
            <div className="flex justify-end items-center gap-1">
              <span id="hoveredV3Volume" className="text-sm">
                v3
              </span>
              <span className="bg-[#A755DD] rounded-[4px] w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      <ReactECharts
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