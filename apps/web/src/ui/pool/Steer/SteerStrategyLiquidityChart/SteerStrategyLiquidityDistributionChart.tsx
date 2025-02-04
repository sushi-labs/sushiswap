import { useTheme } from 'next-themes'
import React, { type FC, useMemo, useState } from 'react'
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer'
import colors from 'tailwindcss/colors'

import type { ChartEntry } from '../../LiquidityChartRangeInput/types'

import ReactEChartsCore from 'echarts-for-react/lib/core'
import type { EChartsOption } from 'echarts-for-react/lib/types'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markArea'
import 'echarts/lib/component/markLine'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/visual/seriesColor'

interface SteerStrategyLiquidityDistributionChart {
  series: ChartEntry[]
  current: number
  steerRange: {
    minPrice: number
    maxPrice: number
  }
}

export const SteerStrategyLiquidityDistributionChart: FC<
  SteerStrategyLiquidityDistributionChart
> = ({ series: _series, current: _current, steerRange }) => {
  const { resolvedTheme } = useTheme()

  const [invertTokens] = useState(false)

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

  const DEFAULT_OPTION = useMemo<EChartsOption>(
    () => ({
      toolbox: {
        show: false,
      },
      grid: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
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
          markArea: {
            silent: true,
            itemStyle: {
              color: 'purple',
              opacity: 0.9,
            },
            data: [
              [
                {
                  xAxis: steerRange.minPrice,
                },
                {
                  xAxis: steerRange.maxPrice,
                },
              ],
            ],
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
              {
                xAxis: steerRange.minPrice,
                symbol: 'none',
                lineStyle: {
                  color: 'purple',
                  type: 'solid',
                },
              },
              {
                xAxis: steerRange.maxPrice,
                symbol: 'none',
                lineStyle: {
                  color: 'purple',
                  type: 'solid',
                },
              },
            ],
            label: {
              normal: {
                show: false,
              },
            },
            animation: false,
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 2,
          data: series.map((d) => [d.price0, d.activeLiquidity]),
        },
      ],
    }),
    [series, steerRange.minPrice, steerRange.maxPrice, current, resolvedTheme],
  )

  return (
    <>
      <div className="w-full h-full">
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <ReactEChartsCore
              echarts={echarts}
              option={DEFAULT_OPTION}
              style={{ height, width }}
            />
          )}
        </ReactVirtualizedAutoSizer>
      </div>
    </>
  )
}
