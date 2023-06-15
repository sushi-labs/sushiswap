import { formatPercent, formatUSD } from '@sushiswap/format'
import { AppearOnMount, Typography, classNames } from '@sushiswap/ui'
import { format } from 'date-fns'
import { EChartsOption } from 'echarts-for-react/lib/types'
import { FC, useCallback, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

import tailwindConfig from '../../../tailwind.config.js'
import { usePoolGraphData } from '../../../lib/hooks'
import { useTheme } from 'next-themes'
import { PoolChartPeriod, PoolChartType } from './types'
import { chartPeriods } from './constants'
import { ChainId } from '@sushiswap/chain'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import resolveConfig from 'tailwindcss/resolveConfig'

interface PoolChartProps {
  chart: PoolChartType.Volume | PoolChartType.Fees | PoolChartType.TVL | PoolChartType.APR
  period: PoolChartPeriod
  address: string
  chainId: ChainId
}

const tailwind = resolveConfig(tailwindConfig)

export const PoolChartGraph: FC<PoolChartProps> = ({ chart, period, address, chainId }) => {
  const { resolvedTheme } = useTheme()

  const { data: graphPair, isLoading } = usePoolGraphData({ poolAddress: address, chainId })

  const swapFee = graphPair ? graphPair?.swapFee / 10000 : 0

  const [xData, yData]: [number[], number[]] = useMemo(() => {
    const data =
      (chartPeriods[period] < chartPeriods[PoolChartPeriod.Week]
        ? graphPair?.hourSnapshots
        : graphPair?.daySnapshots) || []

    const currentDate = Math.round(Date.now())
    const [x, y] = data.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur.date * 1000 >= currentDate - chartPeriods[period]) {
          acc[0].push(cur.date)
          if (chart === PoolChartType.Fees) {
            acc[1].push(Number(cur.volumeUSD * Number(swapFee)))
          } else if (chart === PoolChartType.Volume) {
            acc[1].push(Number(cur.volumeUSD))
          } else if (chart === PoolChartType.TVL) {
            acc[1].push(Number(cur.liquidityUSD))
          } else if (chart === PoolChartType.APR) {
            acc[1].push(Number(cur.apr))
          }
        }
        return acc
      },
      [[], []]
    )

    return [x.reverse(), y.reverse()]
  }, [chart, graphPair?.hourSnapshots, graphPair?.daySnapshots, period, swapFee])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      if (valueNodes[0]) {
        if (chart === PoolChartType.APR) {
          valueNodes[0].innerHTML = formatPercent(value)
        } else {
          valueNodes[0].innerHTML = formatUSD(value)
        }
      }

      if (valueNodes[1]) {
        if (chart === PoolChartType.Volume) {
          valueNodes[1].innerHTML = formatUSD(value * Number(swapFee))
        }
      }

      if (nameNodes[0]) {
        nameNodes[0].innerHTML = format(
          new Date(name * 1000),
          `dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? ' p' : ''}`
        )
      }
    },
    [period, chart, swapFee]
  )

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        // @ts-ignore
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm dark:text-slate-50 text-gray-900 font-medium">${
              chart === PoolChartType.APR ? formatPercent(params[0].value) : formatUSD(params[0].value)
            }</span>
            <span class="text-xs text-gray-500 dark:text-slate-400 font-medium">${
              date instanceof Date && !isNaN(date?.getTime())
                ? format(date, `dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.Week] ? ' p' : ''}`)
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
          type: chart === PoolChartType.TVL || chart === PoolChartType.APR ? 'line' : 'bar',
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
    [resolvedTheme, xData, chart, yData, onMouseOver, period]
  )

  return (
    <>
      <div className="flex flex-col">
        <Typography variant="xl" weight={500} className="text-gray-900 dark:text-slate-50">
          <span className="hoveredItemValue">
            {chart === PoolChartType.APR ? formatPercent(yData[yData.length - 1]) : formatUSD(yData[yData.length - 1])}
          </span>{' '}
          {chart === PoolChartType.Volume && (
            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
              <span className="text-xs top-[-2px] relative">•</span>{' '}
              <span className="hoveredItemValue">{formatUSD(Number(yData[yData.length - 1]) * Number(swapFee))}</span>{' '}
              earned
            </span>
          )}
        </Typography>
        {xData.length && (
          <Typography variant="sm" className="text-gray-500 dark:text-slate-500 hoveredItemName">
            <AppearOnMount>{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}</AppearOnMount>
          </Typography>
        )}
      </div>
      {isLoading ? (
        <Skeleton.Box className={classNames('h-[400px] w-full dark:via-slate-800 dark:to-slate-900')} />
      ) : (
        <ReactECharts option={DEFAULT_OPTION} style={{ height: 400 }} />
      )}
    </>
  )
}
