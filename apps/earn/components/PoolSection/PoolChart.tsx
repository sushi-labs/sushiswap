import { formatPercent, formatUSD } from '@sushiswap/format'
import { Pool } from '@sushiswap/client'
import { AppearOnMount, classNames, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import { FC, useCallback, useMemo, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'
import { useGraphPool } from '../../lib/hooks/api/useGraphPool'

import tailwindConfig from '../../tailwind.config.js'
import { Button } from '@sushiswap/ui/future/components/button'
import { useMediaQuery } from '@sushiswap/hooks'

const tailwind = resolveConfig(tailwindConfig)

interface PoolChartProps {
  pool: Pool
}

enum PoolChartType {
  Volume,
  TVL,
  Fees,
  APR,
}

enum PoolChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const chartTimespans: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.Day]: 86400 * 1000,
  [PoolChartPeriod.Week]: 604800 * 1000,
  [PoolChartPeriod.Month]: 2629746 * 1000,
  [PoolChartPeriod.Year]: 31556952 * 1000,
  [PoolChartPeriod.All]: Infinity,
}

export const PoolChart: FC<PoolChartProps> = ({ pool }) => {
  const { data: graphPair, isLoading } = useGraphPool(pool)
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' })
  const [chartType, setChartType] = useState<PoolChartType>(PoolChartType.Volume)
  const [chartPeriod, setChartPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.Month)

  const [xData, yData] = useMemo(() => {
    const data =
      (chartTimespans[chartPeriod] < chartTimespans[PoolChartPeriod.Week]
        ? graphPair.hourSnapshots
        : graphPair.daySnapshots) || []

    const currentDate = Math.round(Date.now())
    const [x, y]: [number[], number[]] = data.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur.date * 1000 >= currentDate - chartTimespans[chartPeriod]) {
          acc[0].push(cur.date)
          if (chartType === PoolChartType.Fees) {
            acc[1].push(Number(cur.volumeUSD * (pool.swapFee * 100)))
          } else if (chartType === PoolChartType.Volume) {
            acc[1].push(Number(cur.volumeUSD))
          } else if (chartType === PoolChartType.TVL) {
            acc[1].push(Number(cur.liquidityUSD))
          } else if (chartType === PoolChartType.APR) {
            acc[1].push(Number(cur.apr))
          }
        }
        return acc
      },
      [[], []]
    )

    return [x.reverse(), y.reverse()]
  }, [chartPeriod, graphPair.hourSnapshots, graphPair.daySnapshots, chartType, pool.swapFee])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      if (chartType === PoolChartType.APR) {
        valueNodes[0].innerHTML = formatPercent(value)
      } else {
        valueNodes[0].innerHTML = formatUSD(value)
      }

      if (chartType === PoolChartType.Volume) {
        valueNodes[1].innerHTML = formatUSD(value * pool.swapFee)
      }
      nameNodes[0].innerHTML = format(
        new Date(name * 1000),
        `dd MMM yyyy${chartTimespans[chartPeriod] < chartTimespans[PoolChartPeriod.Week] ? ' p' : ''}`
      )
    },
    [chartPeriod, chartType, pool.swapFee]
  )

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        // @ts-ignore
        backgroundColor: !isDark ? tailwind.theme.colors.white : tailwind.theme.colors.slate['700'],
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
            <span class="text-sm dark:text-slate-50 text-gray-900 font-semibold">${
              chartType === PoolChartType.APR ? formatPercent(params[0].value) : formatUSD(params[0].value)
            }</span>
            <span class="text-xs text-gray-500 dark:text-slate-400 text-slate-600 font-medium">${
              date instanceof Date && !isNaN(date?.getTime())
                ? format(
                    date,
                    `dd MMM yyyy${chartTimespans[chartPeriod] < chartTimespans[PoolChartPeriod.Week] ? ' p' : ''}`
                  )
                : ''
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
          data: xData,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          name: 'Volume',
        },
      ],
      series: [
        {
          name: 'Volume',
          type: chartType === PoolChartType.TVL || chartType === PoolChartType.APR ? 'line' : 'bar',
          smooth: true,
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
    [isDark, xData, chartType, yData, onMouseOver, chartPeriod]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between items-center gap-5 md:flex-row">
        <div className="flex items-center gap-1">
          <Button
            size="xs"
            variant={chartType === PoolChartType.Volume ? 'outlined' : 'empty'}
            color={chartType === PoolChartType.Volume ? 'blue' : 'default'}
            onClick={() => setChartType(PoolChartType.Volume)}
          >
            Volume
          </Button>
          <Button
            size="xs"
            variant={chartType === PoolChartType.TVL ? 'outlined' : 'empty'}
            color={chartType === PoolChartType.TVL ? 'blue' : 'default'}
            onClick={() => setChartType(PoolChartType.TVL)}
          >
            TVL
          </Button>
          <Button
            size="xs"
            variant={chartType === PoolChartType.Fees ? 'outlined' : 'empty'}
            color={chartType === PoolChartType.Fees ? 'blue' : 'default'}
            onClick={() => setChartType(PoolChartType.Fees)}
          >
            Fees
          </Button>
          <Button
            size="xs"
            variant={chartType === PoolChartType.APR ? 'outlined' : 'empty'}
            color={chartType === PoolChartType.APR ? 'blue' : 'default'}
            onClick={() => setChartType(PoolChartType.APR)}
          >
            APR
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            size="xs"
            variant={chartPeriod === PoolChartPeriod.Day ? 'outlined' : 'empty'}
            color={chartPeriod === PoolChartPeriod.Day ? 'blue' : 'default'}
            onClick={() => setChartPeriod(PoolChartPeriod.Day)}
          >
            1D
          </Button>
          <Button
            size="xs"
            variant={chartPeriod === PoolChartPeriod.Week ? 'outlined' : 'empty'}
            color={chartPeriod === PoolChartPeriod.Week ? 'blue' : 'default'}
            onClick={() => setChartPeriod(PoolChartPeriod.Week)}
          >
            1W
          </Button>
          <Button
            size="xs"
            variant={chartPeriod === PoolChartPeriod.Month ? 'outlined' : 'empty'}
            color={chartPeriod === PoolChartPeriod.Month ? 'blue' : 'default'}
            onClick={() => setChartPeriod(PoolChartPeriod.Month)}
          >
            1M
          </Button>
          <Button
            size="xs"
            variant={chartPeriod === PoolChartPeriod.Year ? 'outlined' : 'empty'}
            color={chartPeriod === PoolChartPeriod.Year ? 'blue' : 'default'}
            onClick={() => setChartPeriod(PoolChartPeriod.Year)}
          >
            1Y
          </Button>
          <Button
            size="xs"
            variant={chartPeriod === PoolChartPeriod.All ? 'outlined' : 'empty'}
            color={chartPeriod === PoolChartPeriod.All ? 'blue' : 'default'}
            onClick={() => setChartPeriod(PoolChartPeriod.All)}
          >
            All
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography variant="xl" weight={500} className="dark:text-slate-50 text-gray-900">
          <span className="hoveredItemValue">
            {chartType === PoolChartType.APR
              ? formatPercent(yData[yData.length - 1])
              : formatUSD(yData[yData.length - 1])}
          </span>{' '}
          {chartType === PoolChartType.Volume && (
            <span className="text-sm font-medium  text-gray-600 dark:text-slate-300">
              <span className="text-xs top-[-2px] relative">•</span>{' '}
              <span className="hoveredItemValue">
                {formatUSD(Number(yData[yData.length - 1]) * Number(pool.swapFee))}
              </span>{' '}
              earned
            </span>
          )}
        </Typography>
        {xData.length && (
          <Typography variant="sm" className="dark:text-slate-500 text-gray-500 hoveredItemName">
            <AppearOnMount>{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}</AppearOnMount>
          </Typography>
        )}
      </div>
      <ReactECharts
        option={DEFAULT_OPTION}
        showLoading={isLoading}
        loadingOption={{
          text: 'loading',
          // @ts-ignore
          color: tailwind.theme.colors.blue['500'],
          textColor: 'inherit',
          maskColor: 'rgba(255, 255, 255, 0)',
          zlevel: 0,

          // Font size. Available since `v4.8.0`.
          fontSize: 12,
          // Show an animated "spinner" or not. Available since `v4.8.0`.
          showSpinner: true,
          // Radius of the "spinner". Available since `v4.8.0`.
          spinnerRadius: 10,
          // Line width of the "spinner". Available since `v4.8.0`.
          lineWidth: 5,
          // Font thick weight. Available since `v5.0.1`.
          fontWeight: 'normal',
          // Font style. Available since `v5.0.1`.
          fontStyle: 'normal',
          // Font family. Available since `v5.0.1`.
          fontFamily: 'sans-serif',
        }}
        style={{ height: 400 }}
      />
    </div>
  )
}
