'use client'

import type { GetDexMetricsResponse } from '@sushiswap/graph-client/kadena'
import { useIsMounted } from '@sushiswap/hooks'
import { addDays, differenceInDays, parseISO } from 'date-fns'
import format from 'date-fns/format'
import ReactEcharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi'

interface TVLChartProps {
  data: GetDexMetricsResponse | undefined
}

export const TVLChart: FC<TVLChartProps> = ({ data }) => {
  const isMounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  const [tvlSeries, latestTvl, latestDate] = useMemo(() => {
    if (!data) return [[], 0, 0]

    const filled = data?.tvlHistory
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
                value: prev.value,
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

    const series = filled.map((d) => [new Date(d.timestamp).getTime(), d.value])
    const last = series.at(-1) ?? [Date.now(), 0]

    return [series, last[1] as number, last[0] as number]
  }, [data])

  const onMouseOver = useCallback((params: { data: number[] }[]) => {
    const tvlNode = document.getElementById('hoveredTVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode) tvlNode.innerHTML = formatUSD(params[0].data[1])
    if (dateNode)
      dateNode.innerHTML = format(
        new Date(params[0].data[0]),
        'dd MMM yyyy HH:mm aa',
      )
  }, [])

  const onMouseLeave = useCallback(() => {
    const tvlNode = document.getElementById('hoveredTVL')
    const dateNode = document.getElementById('hoveredTVLDate')

    if (tvlNode) tvlNode.innerHTML = formatUSD(latestTvl)
    if (dateNode)
      dateNode.innerHTML = format(new Date(latestDate), 'dd MMM yyyy HH:mm aa')
  }, [latestTvl, latestDate])

  const option: EChartsOption = useMemo(
    () => ({
      tooltip: { trigger: 'axis', formatter: onMouseOver },
      color: ['#3B7EF6'],
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
            const date = new Date(value)
            const label = `${date.toLocaleString('en-US', {
              month: 'short',
            })} ${date.getDate()}\n${date.getFullYear()}`

            return index === 0
              ? `{min|${label}}`
              : value > tvlSeries.at(-2)?.[0]!
                ? `{max|${label}}`
                : label
          },
          padding: [0, 0, 0, 60],
          rich: {
            min: { padding: [0, 10, 0, 50] },
            max: { padding: [0, 50, 0, 10] },
          },
        },
      },
      yAxis: { show: false },
      series: [
        {
          name: 'TVL',
          type: 'line',
          smooth: true,
          lineStyle: { width: 0 },
          showSymbol: false,
          areaStyle: { color: '#3B7EF6', opacity: 1 },
          data: tvlSeries,
        },
      ],
    }),
    [onMouseOver, tvlSeries, resolvedTheme],
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-muted-foreground">Kadena TVL</span>

        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-medium">
              <span id="hoveredTVL">{formatUSD(latestTvl)}</span>
            </div>
            <div>
              <span
                id="hoveredTVLDate"
                className="text-sm text-gray-500 dark:text-slate-500"
              >
                {isMounted
                  ? format(new Date(latestDate), 'MMM dd yyyy HH:mm aa')
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {isMounted && (
        <ReactEcharts
          option={option}
          echarts={echarts}
          style={{ height: 400 }}
          onEvents={{ globalout: onMouseLeave }}
        />
      )}
    </div>
  )
}
