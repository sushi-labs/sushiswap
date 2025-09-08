'use client'

import { addDays, differenceInDays } from 'date-fns'
import format from 'date-fns/format'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi'
import type { DexMetrics } from '~kadena/_common/types/get-dex-metrics'

interface VolumeChartProps {
  data: DexMetrics | undefined
}

export const VolumeChart: FC<VolumeChartProps> = ({ data }) => {
  const { resolvedTheme } = useTheme()

  const [volumeSeries, totalVolume] = useMemo(() => {
    if (!data) return [[], 0]

    const last30 = data?.volumeHistory
      ?.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      )
      .reduce(
        (acc, curr, idx) => {
          const prev = idx !== 0 ? acc[acc.length - 1] : undefined
          const currDate = new Date(curr.timestamp) //  timestamps are ISO strings

          if (prev) {
            const prevDate = prev
              ? new Date(prev.timestamp)
              : new Date(curr.timestamp)
            const daysDiff = differenceInDays(currDate, prevDate)

            // Fill in missing days
            for (let i = 1; i < daysDiff; i++) {
              const missingDate = addDays(prevDate, i)
              acc.push({
                timestamp: `${missingDate.toISOString().split('T')?.[0]}T04:00:00.000Z`,
                value: 0,
              })
            }
          }

          acc.push({
            timestamp: `${currDate.toISOString().split('T')?.[0]}T04:00:00.000Z`,
            value: curr.value,
          })

          return acc
        },
        [] as { timestamp: string; value: number }[],
      )
      .slice(-30)

    const series = last30.map((d) => [new Date(d.timestamp).getTime(), d.value])

    const total = series.reduce((sum, [, v]) => sum + v, 0)

    return [series, total]
  }, [data])

  const onMouseOver = useCallback((params: { data: number[] }[]) => {
    const volNode = document.getElementById('hoveredVolume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volNode) volNode.innerHTML = formatUSD(params[0].data[1])
    if (dateNode)
      dateNode.innerHTML = format(
        new Date(params[0].data[0]),
        'dd MMM yyyy HH:mm aa',
      )
  }, [])

  const onMouseLeave = useCallback(() => {
    const volNode = document.getElementById('hoveredVolume')
    const dateNode = document.getElementById('hoveredVolumeDate')

    if (volNode) volNode.innerHTML = formatUSD(totalVolume)
    if (dateNode) dateNode.innerHTML = 'Past month'
  }, [totalVolume])

  const option: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis', formatter: onMouseOver },
      grid: { top: 0, left: 0, right: 0 },
      xAxis: {
        type: 'time',
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          hideOverlap: true,
          color: resolvedTheme === 'dark' ? 'white' : 'black',
          formatter: (value: number, index: number) => {
            const label = format(new Date(value), 'MMM d')
            return index === 0
              ? `{min|${label}}`
              : value > volumeSeries.at(-2)?.[0]!
                ? `{max|${label}}`
                : label
          },
          padding: [0, 30, 0, 0],
          rich: {
            min: { padding: [0, 10, 0, 50] },
            max: { padding: [0, 50, 0, 10] },
          },
        },
      },
      yAxis: { show: false },
      series: [
        {
          name: 'Volume',
          type: 'bar',
          data: volumeSeries,
          itemStyle: { color: '#3B7EF6', borderRadius: [0, 0, 2, 2] },
        },
      ],
    }),
    [onMouseOver, resolvedTheme, volumeSeries],
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-muted-foreground">Kadena Volume</span>
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium">
              <span id="hoveredVolume">{formatUSD(totalVolume)}</span>
            </div>
            <div>
              <span
                id="hoveredVolumeDate"
                className="text-sm text-gray-500 dark:text-slate-500"
              >
                Past month
              </span>
            </div>
          </div>
        </div>
      </div>

      <ReactECharts
        option={option}
        echarts={echarts}
        style={{ height: 400 }}
        onEvents={{ globalout: onMouseLeave }}
      />
    </div>
  )
}
