'use client'

import { getSteerVaultAprTimeseries } from '@sushiswap/steer-sdk'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import React, { useMemo } from 'react'
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer'

interface _SteerAPRChartProps {
  timeseries: Awaited<ReturnType<typeof getSteerVaultAprTimeseries>>
}

export function _SteerAPRChart({ timeseries }: _SteerAPRChartProps) {
  const chartConfig = useMemo<EChartsOption>(
    () => ({
      toolbox: {
        show: false,
      },
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      xAxis: [
        {
          show: false,
          type: 'time',
          data: timeseries?.map((d) => d.startTime * 1000),
          name: 'Date',
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          name: 'APR',
        },
      ],
      series: [
        {
          name: 'APR',
          type: 'line',
          smooth: true,
          showSymbol: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              barBorderRadius: 1,
            },
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx: number) {
            return idx * 2
          },
          data: timeseries?.map((d) => [d.startTime * 1000, d.feeApr]),
        },
      ],
    }),
    [timeseries]
  )

  const [leftDate, rightDate] = useMemo(() => {
    if (!timeseries) return ['', '']

    const leftDate = new Date(timeseries[0].startTime * 1000)
    const rightDate = new Date(timeseries[timeseries.length - 1].startTime * 1000)

    // less than a year
    if (rightDate.getTime() - leftDate.getTime() < 86400 * 365 * 1000) {
      return [
        leftDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rightDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ]
    }

    return [
      leftDate.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
      rightDate.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' }),
    ]
  }, [timeseries])

  if (!timeseries)
    return <div className="w-full h-full items-center flex justify-center">Failed to fetch chart data.</div>

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="w-full h-full">
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => <ReactECharts option={chartConfig} style={{ height, width }} />}
        </ReactVirtualizedAutoSizer>
      </div>
      <div className="flex justify-between w-full text-muted-foreground font-normal text-sm">
        <div>{leftDate}</div>
        <div>{rightDate}</div>
      </div>
    </div>
  )
}
