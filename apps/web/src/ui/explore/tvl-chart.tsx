'use client'

import type { AnalyticsDayBuckets } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import format from 'date-fns/format'
import ReactEcharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { type ChainId, EvmChain, isEvmChainId } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'
import { formatUSD } from 'sushi/format'

interface TVLChart {
  data: AnalyticsDayBuckets
  chainId: ChainId
  startDate?: Date
}

export const TVLChart: FC<TVLChart> = ({ data, chainId, startDate }) => {
  const isMounted = useIsMounted()

  const { resolvedTheme } = useTheme()
  const isBladeChain = isEvmChainId(chainId) && isBladeChainId(chainId)

  const [v2, v3, blade, combinedTVL, currentDate] = useMemo(() => {
    const v2Map = new Map(
      data.v2.map((item) => [item.date * 1000, item.liquidityUSD]),
    )
    const v3Map = new Map(
      data.v3.map((item) => [item.date * 1000, item.liquidityUSD]),
    )
    const bladeData = isBladeChain && data.blade ? data.blade : []
    const bladeMap = new Map(
      bladeData.map((item) => [item.date * 1000, item.liquidityUSD]),
    )

    const uniqueDates = new Set<number>()
    data.v2.forEach((item) => uniqueDates.add(item.date * 1000))
    data.v3.forEach((item) => uniqueDates.add(item.date * 1000))
    bladeData.forEach((item) => uniqueDates.add(item.date * 1000))

    const startTimestamp = startDate ? startDate.getTime() : 0
    const filteredDates = startTimestamp
      ? Array.from(uniqueDates).filter((date) => date >= startTimestamp)
      : Array.from(uniqueDates)

    const sortedDates = filteredDates.sort((a, b) => a - b)
    const v2 = sortedDates.map((date) => [date, v2Map.get(date) ?? 0])
    const v3 = sortedDates.map((date) => [date, v3Map.get(date) ?? 0])
    const blade = sortedDates.map((date) => [date, bladeMap.get(date) ?? 0])

    const v2TVL = v2[v2.length - 1]?.[1] ?? 0
    const v3TVL = v3[v3.length - 1]?.[1] ?? 0
    const bladeTVL = blade[blade.length - 1]?.[1] ?? 0
    const combinedTVL = v2TVL + v3TVL + bladeTVL
    const currentDate =
      sortedDates.length > 0
        ? sortedDates[sortedDates.length - 1]
        : new Date().getTime()

    return [v2, v3, blade, combinedTVL, currentDate]
  }, [data, startDate, isBladeChain])

  const zIndex = useMemo(() => {
    const v2Sum = v2.reduce((sum, [_, value]) => sum + value, 0)
    const v3Sum = v3.reduce((sum, [_, value]) => sum + value, 0)

    if (v2Sum < v3Sum) {
      return { v2: 2, v3: 1, blade: 3 }
    } else {
      return { v2: 1, v3: 2, blade: 3 }
    }
  }, [v2, v3])

  const onMouseOver = useCallback((params: { data: number[] }[]) => {
    const tvlNode = document.getElementById('hoveredTVL')
    const v2TVLNode = document.getElementById('hoveredV2TVL')
    const v3TVLNode = document.getElementById('hoveredV3TVL')
    const bladeTVLNode = document.getElementById('hoveredBladeTVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode)
      tvlNode.innerHTML = formatUSD(
        params[0].data[1] + params[1].data[1] + (params[2]?.data?.[1] ?? 0),
      )
    if (dateNode)
      dateNode.innerHTML = format(
        new Date(params[0].data[0]),
        'dd MMM yyyy HH:mm aa',
      )
    if (v2TVLNode)
      v2TVLNode.innerHTML = params[0].data[1]
        ? formatUSD(params[0].data[1])
        : ''
    if (v3TVLNode)
      v3TVLNode.innerHTML = params[1].data[1]
        ? formatUSD(params[1].data[1])
        : ''
    if (bladeTVLNode)
      bladeTVLNode.innerHTML = params[2]?.data?.[1]
        ? formatUSD(params[2].data[1])
        : ''
  }, [])

  const onMouseLeave = useCallback(() => {
    const tvlNode = document.getElementById('hoveredTVL')
    const v2TVLNode = document.getElementById('hoveredV2TVL')
    const v3TVLNode = document.getElementById('hoveredV3TVL')
    const bladeTVLNode = document.getElementById('hoveredBladeTVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode) tvlNode.innerHTML = formatUSD(combinedTVL)
    if (dateNode)
      dateNode.innerHTML = format(new Date(currentDate), 'dd MMM yyyy HH:mm aa')
    if (v2TVLNode) v2TVLNode.innerHTML = ''
    if (v3TVLNode) v3TVLNode.innerHTML = ''
    if (bladeTVLNode) bladeTVLNode.innerHTML = ''
  }, [combinedTVL, currentDate])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: onMouseOver,
      },
      color: ['#3B7EF6', '#A755DD', '#F23BF6'],
      grid: {
        top: 0,
        left: 0,
        right: 0,
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
          axisLabel: {
            hideOverlap: true,
            showMinLabel: true,
            showMaxLabel: true,
            color: resolvedTheme === 'dark' ? 'white' : 'black',
            formatter: (value: number, index: number) => {
              const date = new Date(value)
              const label = `${date.toLocaleString('en-US', {
                month: 'short',
              })} ${date.getDate()}\n${date.getFullYear()}`

              return index === 0
                ? `{min|${label}}`
                : value > v2?.[v2.length - 2]?.[0]
                  ? `{max|${label}}`
                  : label
            },
            padding: [0, 10, 0, 10],
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
        ...(isBladeChain
          ? [
              {
                name: 'blade',
                type: 'line',
                stack: 'blade',
                smooth: true,
                lineStyle: {
                  width: 0,
                },
                showSymbol: false,
                areaStyle: {
                  color: '#F23BF6',
                  opacity: 1,
                },
                data: blade,
                z: zIndex.blade,
              },
            ]
          : []),
      ],
    }),
    [onMouseOver, v2, v3, blade, zIndex, resolvedTheme, isBladeChain],
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <span className="text-muted-foreground text-sm">
          {EvmChain.from(chainId)?.name} TVL
        </span>
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
                {isMounted
                  ? format(new Date(currentDate), 'dd MMM yyyy HH:mm aa')
                  : ''}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-2 text-sm">
              <span id="hoveredV2TVL" />
              <span className="flex gap-1 items-center">
                <span className="font-medium">v2</span>
                <span className="bg-[#3B7EF6] rounded-[4px] w-3 h-3" />
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 text-sm">
              <span id="hoveredV3TVL" />
              <span className="flex gap-1 items-center">
                <span className="font-medium">v3</span>
                <span className="bg-[#A755DD] rounded-[4px] w-3 h-3" />
              </span>
            </div>
            {isBladeChain && (
              <div className="flex justify-between items-center gap-2 text-sm">
                <span id="hoveredBladeTVL" />
                <span className="flex gap-1 items-center">
                  <span className="font-medium">blade</span>
                  <span className="bg-[#F23BF6] rounded-[4px] w-3 h-3" />
                </span>
              </div>
            )}
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
