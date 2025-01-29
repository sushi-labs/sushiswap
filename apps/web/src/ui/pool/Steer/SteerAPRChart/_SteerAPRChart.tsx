'use client'

import type { getSteerVaultAprTimeseries } from '@sushiswap/steer-sdk'
import { SkeletonBox } from '@sushiswap/ui'
import format from 'date-fns/format'
import React, { useMemo } from 'react'
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer'
import { formatPercent } from 'sushi/format'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/visual/seriesColor'

const tailwind = resolveConfig(tailwindConfig)

interface _SteerAPRChartProps {
  loading: boolean
  timeseries:
    | Awaited<ReturnType<typeof getSteerVaultAprTimeseries>>
    | null
    | undefined
}

export function _SteerAPRChart({ timeseries, loading }: _SteerAPRChartProps) {
  const chartConfig = useMemo<EChartsOption>(
    () => ({
      toolbox: {
        show: false,
      },
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        // @ts-ignore
        backgroundColor: tailwind.theme.colors.slate['700'],
        textStyle: {
          // @ts-ignore
          color: tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          const date = format(new Date(params[0].axisValue), 'dd MMM yyyy')
          const apr = formatPercent(params[0].data[1])

          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-50 font-bold">${apr}</span>
            <span class="text-xs text-slate-400 font-medium">${date}</span>
          </div>`
        },
        borderWidth: 0,
      },
      visualMap: {
        show: false,
        // @ts-ignore
        color: [tailwind.theme.colors.blue['500']],
      },
      grid: {
        top: 2,
        bottom: 2,
        left: 2,
        right: 2,
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
          animationDelayUpdate: (idx: number) => idx * 2,
          data: timeseries?.map((d) => [d.startTime * 1000, d.feeApr]),
        },
      ],
    }),
    [timeseries],
  )

  const [leftDate, rightDate] = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return ['', '']

    const leftDate = new Date(timeseries[0].startTime * 1000)
    const rightDate = new Date(
      timeseries[timeseries.length - 1].startTime * 1000,
    )

    // less than a year
    if (rightDate.getTime() - leftDate.getTime() < 86400 * 365 * 1000) {
      return [
        leftDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        rightDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      ]
    }

    return [
      leftDate.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
      rightDate.toLocaleDateString('en-US', {
        year: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
    ]
  }, [timeseries])

  if (loading) return <SkeletonBox className="w-full h-full" />

  if (!timeseries && !loading)
    return (
      <div className="w-full h-full items-center flex justify-center">
        Failed to fetch chart data.
      </div>
    )

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="w-full h-full">
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <>
              {timeseries?.length ? (
                <ReactEChartsCore
                  echarts={echarts}
                  option={chartConfig}
                  style={{ height, width }}
                />
              ) : (
                <div
                  style={{ width, height }}
                  className="flex justify-center items-center text-slate-300 text-sm"
                >
                  No data found.
                </div>
              )}
            </>
          )}
        </ReactVirtualizedAutoSizer>
      </div>
      <div className="flex justify-between w-full text-muted-foreground font-normal text-sm">
        <div>{leftDate}</div>
        <div>{rightDate}</div>
      </div>
    </div>
  )
}
