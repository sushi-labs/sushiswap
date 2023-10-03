'use client'

import { formatUSD } from '@sushiswap/format'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  classNames,
  SkeletonBox,
  SkeletonText,
  Toggle,
} from '@sushiswap/ui'
import { format } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import { FC, useCallback, useMemo, useState } from 'react'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const tailwind = resolveConfig(tailwindConfig)

enum TvlChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<TvlChartPeriod, number> = {
  [TvlChartPeriod.Day]: 86400 * 1000,
  [TvlChartPeriod.Week]: 604800 * 1000,
  [TvlChartPeriod.Month]: 2629746 * 1000,
  [TvlChartPeriod.Year]: 31556952 * 1000,
  [TvlChartPeriod.All]: Infinity,
}

export const TVLChart: FC<{ x: number[]; y: number[] }> = ({ x, y }) => {
  const [chartPeriod, setChartPeriod] = useState<TvlChartPeriod>(TvlChartPeriod.Month)

  const [xData, yData] = useMemo(() => {
    const currentDate = Math.round(Date.now())
    const predicates = x?.map((x) => x * 1000 >= currentDate - chartTimespans[chartPeriod])
    return [x?.filter((x, i) => predicates[i]).reverse(), y?.filter((y, i) => predicates[i]).reverse()]
  }, [chartPeriod, x, y])

  // Transient update for performance
  const onMouseOver = useCallback(({ name, value }: { name: number; value: number }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValueTVL')
    const nameNodes = document.getElementsByClassName('hoveredItemNameTVL')

    valueNodes[0].innerHTML = formatUSD(value)
    nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
  }, [])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
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
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-50 font-bold">${formatUSD(params[0].value)}</span>
            <span class="text-xs text-slate-400 font-medium">${
              date instanceof Date && !isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      toolbox: {
        show: false,
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
      },
      visualMap: {
        show: false,
        // @ts-ignore
        color: [tailwind.theme.colors.blue['500']],
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: true,
          data: xData,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          scale: true,
          name: 'Volume',
          max: 'dataMax',
          min: 'dataMin',
        },
      ],
      series: [
        {
          name: 'Volume',
          type: 'line',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            // @ts-ignore
            color: tailwind.theme.colors.blue['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx: number) {
            return idx * 2
          },
          data: yData,
        },
      ],
    }),
    [onMouseOver, xData, yData]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total value locked (TVL)</CardTitle>
      </CardHeader>
      <div className="px-6 py-3 flex gap-4 border-t border-b border-accent">
        <Toggle
          size="xs"
          pressed={chartPeriod === TvlChartPeriod.Week}
          onClick={() => setChartPeriod(TvlChartPeriod.Week)}
          className={classNames(
            'font-semibold text-sm',
            chartPeriod === TvlChartPeriod.Week ? 'text-blue' : 'text-slate-500'
          )}
        >
          1W
        </Toggle>
        <Toggle
          size="xs"
          pressed={chartPeriod === TvlChartPeriod.Month}
          onClick={() => setChartPeriod(TvlChartPeriod.Month)}
          className={classNames(
            'font-semibold text-sm',
            chartPeriod === TvlChartPeriod.Month ? 'text-blue' : 'text-slate-500'
          )}
        >
          1M
        </Toggle>
        <Toggle
          size="xs"
          pressed={chartPeriod === TvlChartPeriod.Year}
          onClick={() => setChartPeriod(TvlChartPeriod.Year)}
          className={classNames(
            'font-semibold text-sm',
            chartPeriod === TvlChartPeriod.Year ? 'text-blue' : 'text-slate-500'
          )}
        >
          1Y
        </Toggle>
        <Toggle
          size="xs"
          pressed={chartPeriod === TvlChartPeriod.All}
          onClick={() => setChartPeriod(TvlChartPeriod.All)}
          className={classNames(
            'font-semibold text-sm',
            chartPeriod === TvlChartPeriod.All ? 'text-blue' : 'text-slate-500'
          )}
        >
          ALL
        </Toggle>
      </div>
      <CardHeader>
        <CardTitle>
          {yData && yData.length ? (
            <span className="hoveredItemValueTVL">{formatUSD(yData[yData.length - 1])}</span>
          ) : (
            <SkeletonText fontSize="sm" />
          )}
        </CardTitle>
        <CardDescription>
          {xData && xData.length ? (
            <div className="text-sm text-gray-500 dark:text-slate-500 hoveredItemNameTVL">
              {format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}
            </div>
          ) : (
            <SkeletonText fontSize="sm" />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {xData ? (
          <ReactECharts option={DEFAULT_OPTION} style={{ height: 400 }} />
        ) : (
          <SkeletonBox className={classNames('h-[400px] w-full dark:via-slate-800 dark:to-slate-900')} />
        )}
      </CardContent>
    </Card>
  )
}
