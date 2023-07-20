import { formatUSD } from '@sushiswap/format'
import { useConcentratedLiquidityPoolStats } from '@sushiswap/react-query'
import ReactECharts, { EChartsOption } from 'echarts-for-react'
import React, { FC, useCallback, useMemo } from 'react'
import colors from 'tailwindcss/colors'

import { ChartEntry } from '../../../LiquidityChartRangeInput/types'

interface PoolDepthChartProps {
  poolStats: NonNullable<ReturnType<typeof useConcentratedLiquidityPoolStats>['data']>
  series: ChartEntry[]
  current: number
}

const getTvlUSD = (liquidity: number | string, totalSupply: number | string, liquidityUSD: number | string) =>
  formatUSD((Number(liquidity) / Number(totalSupply)) * Number(liquidityUSD))

export const PoolDepthChart: FC<PoolDepthChartProps> = ({ poolStats, series, current }) => {
  // Transient update for performance
  const onMouseOver = useCallback(({ value }: { name: number[]; value: number[] }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValue')

    if (valueNodes[0]) {
      valueNodes[0].innerHTML = getTvlUSD(value[1], Number(poolStats.totalSupply), Number(poolStats.liquidityUSD))
    }

    if (valueNodes[1]) {
      valueNodes[1].innerHTML = `${value[0].toFixed(3)} ${poolStats.token1.symbol} per ${poolStats.token0.symbol}`
    }
  }, [])

  const DEFAULT_OPTION = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        // rome-ignore lint: echarts doesn't have types
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const price0 = params[0].data[0].toFixed(5)
          const price1 = (1 / params[0].data[0]).toFixed(5)

          const tvlUSD = getTvlUSD(params[0].data[1], poolStats.totalSupply, poolStats.liquidityUSD)

          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
                    <div>Tick stats</div>
                    <div class="grid grid-cols-2 text-sm dark:text-slate-50 text-gray-900 font-medium">
                      <div>${poolStats.token0.symbol} Price:</div>
                      <div class="flex w-full justify-end">${price0} ${poolStats.token1.symbol}</div>
                      <div>${poolStats.token1.symbol} Price:</div>
                      <div class="flex w-full justify-end">${price1} ${poolStats.token0.symbol}</div>
                      <div>Total Value:</div>
                      <div class="flex w-full justify-end">${tvlUSD}</div>
                    </div>
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
        color: [colors.blue['500']],
      },
      xAxis: [
        {
          show: false,
          type: 'value',
          data: series.map((d) => d.price0),
          name: 'Price',
          min: series[0].price0,
          max: series[series.length - 1].price0,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          name: 'Depth',
        },
      ],
      series: [
        {
          name: 'Depth',
          type: 'line',
          step: 'end',
          showSymbol: false,
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: colors.blue['500'],
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                xAxis: current,
                symbol: 'none',
                lineStyle: {
                  color: 'white',
                  type: 'solid',
                },
              },
            ],
            animation: false,
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx: number) {
            return idx * 2
          },
          data: series.map((d) => [d.price0, d.activeLiquidity]),
        },
      ],
    }),
    [series, current, onMouseOver, poolStats]
  )

  const currentLiquidity = useMemo(
    () =>
      // closest entry to current
      series.reduce((prev, curr) => (Math.abs(curr.price0 - current) < Math.abs(prev.price0 - current) ? curr : prev))
        .activeLiquidity,
    [series, current]
  )

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col">
        <p className="space-x-1 text-xl font-medium text-gray-900 dark:text-slate-50">
          <span className="hoveredItemValue">
            {getTvlUSD(currentLiquidity, Number(poolStats.totalSupply), Number(poolStats.liquidityUSD))}
          </span>
          <span className="space-x-1 text-sm font-medium text-gray-600 dark:text-slate-300">
            <span className="text-xs top-[-2px] relative">•</span>
            <span className="hoveredItemValue">
              {current.toFixed(3)} {poolStats.token1.symbol} per {poolStats.token0.symbol}
            </span>
          </span>
        </p>
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 440 }} />
    </div>
  )
}
