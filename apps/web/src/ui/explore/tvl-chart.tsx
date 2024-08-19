'use client'

import { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import format from 'date-fns/format'
import ReactEcharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi/format'

export const TVLChart: FC<{ data: AnalyticsDayBuckets }> = ({ data }) => {
  const { resolvedTheme } = useTheme()

  const [v2, v3, combinedTVL, currentDate] = useMemo(() => {
    const xData = (data.v2.length > data.v3.length ? data.v2 : data.v3).map(
      (data) => data.date * 1000,
    )

    const v2 = xData
      .map((xData, i) => [xData, data.v2[i]?.liquidityUSD ?? 0])
      .reverse()
    const v3 = xData
      .map((xData, i) => [xData, data.v3[i]?.liquidityUSD ?? 0])
      .reverse()
    const combinedTVL = v2[v2.length - 1][1] + v3[v3.length - 1][1]

    const currentDate = xData[0]

    return [v2, v3, combinedTVL, currentDate]
  }, [data])

  const zIndex = useMemo(() => {
    const v2Sum = v2.reduce((sum, [_, value]) => sum + value, 0)
    const v3Sum = v3.reduce((sum, [_, value]) => sum + value, 0)

    if (v2Sum < v3Sum) {
      return { v2: 2, v3: 1 }
    } else {
      return { v2: 1, v3: 2 }
    }
  }, [v2, v3])

  const onMouseOver = useCallback((params: { data: number[] }[]) => {
    const tvlNode = document.getElementById('hoveredTVL')
    const v2TVLNode = document.getElementById('hoveredV2TVL')
    const v3TVLNode = document.getElementById('hoveredV3TVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode)
      tvlNode.innerHTML = formatUSD(params[0].data[1] + params[1].data[1])
    if (dateNode)
      dateNode.innerHTML = format(
        new Date(params[0].data[0]),
        'dd MMM yyyy HH:mm aa',
      )
    if (v2TVLNode)
      v2TVLNode.innerHTML = params[0].data[1]
        ? formatUSD(params[0].data[1])
        : 'v2'
    if (v3TVLNode)
      v3TVLNode.innerHTML = params[1].data[1]
        ? formatUSD(params[1].data[1])
        : 'v3'
  }, [])

  const onMouseLeave = useCallback(() => {
    const tvlNode = document.getElementById('hoveredTVL')
    const v2TVLNode = document.getElementById('hoveredV2TVL')
    const v3TVLNode = document.getElementById('hoveredV3TVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode) tvlNode.innerHTML = formatUSD(combinedTVL)
    if (dateNode)
      dateNode.innerHTML = format(new Date(currentDate), 'dd MMM yyyy HH:mm aa')
    if (v2TVLNode) v2TVLNode.innerHTML = 'v2'
    if (v3TVLNode) v3TVLNode.innerHTML = 'v3'
  }, [combinedTVL, currentDate])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: onMouseOver,
      },
      color: ['#3B7EF6', '#A755DD'],
      grid: {
        top: 0,
        left: 0,
        right: 0,
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
            formatter: (value: number) => {
              const date = new Date(value)
              return `${date.toLocaleString('en-US', {
                month: 'short',
              })} ${date.getDate()}\n${date.getFullYear()}`
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
          type: 'line',
          stack: 'v2',
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            color: '#3B7EF6',
            opacity: 1,
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
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            color: '#A755DD',
            opacity: 1,
          },
          data: v3,
          z: zIndex.v3,
        },
      ],
    }),
    [onMouseOver, v2, v3, zIndex, resolvedTheme],
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-sm">Sushi TVL</span>
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium">
              <span id="hoveredTVL">{formatUSD(combinedTVL)}</span>
            </div>
            <div>
              <div
                id="hoveredTVLDate"
                className="text-sm text-gray-500 dark:text-slate-500"
              >
                {format(new Date(currentDate), 'MMM dd yyyy HH:mm aa')}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-end items-center gap-1">
              <span id="hoveredV2TVL" className="text-sm">
                v2
              </span>
              <span className="bg-[#3B7EF6] rounded-[4px] w-3 h-3" />
            </div>
            <div className="flex justify-end items-center gap-1">
              <span id="hoveredV3TVL" className="text-sm">
                v3
              </span>
              <span className="bg-[#A755DD] rounded-[4px] w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
      <ReactEcharts
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
