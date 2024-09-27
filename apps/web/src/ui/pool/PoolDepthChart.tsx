import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Toggle,
} from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import React, { FC, useCallback, useMemo, useState } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { formatUSD } from 'sushi/format'
import colors from 'tailwindcss/colors'

import { ChartEntry } from './LiquidityChartRangeInput/types'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import { EChartsOption } from 'echarts-for-react/lib/types'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/visual/seriesColor'

interface PoolDepthChartProps {
  poolStats: NonNullable<
    ReturnType<typeof useConcentratedLiquidityPoolStats>['data']
  >
  series: ChartEntry[]
  current: number
}

const getTvlUSD = (
  liquidity: number | bigint | string,
  totalLiquidity: number | bigint | string,
  liquidityUSD: number | string,
) =>
  formatUSD((Number(liquidity) / Number(totalLiquidity)) * Number(liquidityUSD))

export const PoolDepthChart: FC<PoolDepthChartProps> = ({
  poolStats,
  series: _series,
  current: _current,
}) => {
  const { resolvedTheme } = useTheme()

  const [invertTokens, setInvertTokens] = useState(false)

  const [series, current] = useMemo(() => {
    if (invertTokens) {
      return [
        _series
          .map((entry) => ({
            ...entry,
            price0: 1 / entry.price0,
          }))
          .reverse(),
        1 / _current,
      ]
    }

    return [_series, _current]
  }, [invertTokens, _current, _series])

  const [token0, token1] = useMemo(() => {
    const tokens = [poolStats.token0, poolStats.token1]

    if (invertTokens) {
      return tokens.reverse()
    }

    return tokens
  }, [poolStats, invertTokens])

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ value }: { name: number[]; value: number[] }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')

      if (valueNodes[0]) {
        valueNodes[0].innerHTML = `${getTvlUSD(
          value[1],
          Number(poolStats.liquidity),
          Number(poolStats.liquidityUSD),
        )}`
      }

      if (valueNodes[1]) {
        valueNodes[1].innerHTML = `At tick ${value[0].toFixed(3)} ${
          token1.symbol
        } per ${token0.symbol}`
      }
    },
    [poolStats.liquidityUSD, poolStats.liquidity, token0.symbol, token1.symbol],
  )

  const DEFAULT_OPTION = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 12,
          fontWeight: 500,
        },
        formatter: (params: any) => {
          onMouseOver({ name: params[0].name, value: params[0].value })

          const price0 = params[0].data[0].toFixed(5)
          const price1 = (1 / params[0].data[0]).toFixed(5)

          const tvlUSD = getTvlUSD(
            params[0].data[1],
            poolStats.liquidity,
            poolStats.liquidityUSD,
          )

          return `<div class="flex flex-col gap-1.5 bg-white dark:bg-secondary p-4 rounded-lg overflow-hidden shadow-md">
                    <div className="font-normal text-xs text-gray-400 dark:text-slate-500">Tick stats</div>
                    <div class="flex flex-col gap-1 text-xs dark:text-slate-50 text-gray-900">
                      <span>1 ${token0.symbol} = ${price0} ${token1.symbol}</span>
                      <span>1 ${token1.symbol} = ${price1} ${token0.symbol}</span>
                      <span>Value: ${tvlUSD}</span>
                    </div>
                  </div>`
        },
        borderWidth: 0,
      },
      toolbox: {
        show: false,
      },
      grid: {
        top: 5,
        left: 15,
        right: 15,
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
            precision: 12,
            data: [
              {
                xAxis: current,
                symbol: 'none',
                lineStyle: {
                  color: resolvedTheme === 'light' ? 'black' : 'white',
                  type: 'solid',
                },
              },
            ],
            animation: false,
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 2,
          data: series.map((d) => [d.price0, d.activeLiquidity]),
        },
      ],
    }),
    [
      series,
      current,
      resolvedTheme,
      onMouseOver,
      poolStats.liquidity,
      poolStats.liquidityUSD,
      token0.symbol,
      token1.symbol,
    ],
  )

  const currentLiquidity = useMemo(
    () =>
      // closest entry to current
      series.reduce((prev, curr) =>
        Math.abs(curr.price0 - current) < Math.abs(prev.price0 - current)
          ? curr
          : prev,
      ).activeLiquidity,
    [series, current],
  )

  return (
    <>
      <CardHeader>
        <CardTitle className="max-h-[18px]">
          <div className="flex justify-between">
            <span className="hoveredItemValue">
              {getTvlUSD(
                currentLiquidity,
                Number(poolStats.liquidity),
                Number(poolStats.liquidityUSD),
              )}
            </span>
            <div className="flex items-center gap-1">
              <Toggle
                variant="outline"
                onClick={() => setInvertTokens(false)}
                pressed={!invertTokens}
                size="xs"
              >
                {invertTokens ? token1?.symbol : token0?.symbol}
              </Toggle>
              <Toggle
                variant="outline"
                onClick={() => setInvertTokens(true)}
                pressed={invertTokens}
                size="xs"
              >
                {invertTokens ? token0?.symbol : token1?.symbol}
              </Toggle>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <span className="hoveredItemValue">
            At tick: {current.toFixed(3)} {token1.symbol} per {token0.symbol}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReactEChartsCore
          echarts={echarts}
          option={DEFAULT_OPTION}
          style={{ height: 405 }}
        />
      </CardContent>
    </>
  )
}
