'use client'

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SkeletonBox,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import type { EChartsOption } from 'echarts'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import { BarChart } from 'echarts/charts'
import {
  DataZoomComponent,
  GridComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { TopLevelFormatterParams } from 'echarts/types/src/component/tooltip/TooltipModel.js'
import type {
  CallbackDataParams,
  TooltipFormatterCallback,
} from 'echarts/types/src/util/types.js'
import React, { type FC, useCallback, useMemo } from 'react'
import { formatUSD } from 'sushi'
import type {
  EvmCurrency,
  SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
} from 'sushi/evm'
import { SkeletonChart } from '~evm/[chainId]/explore/_ui/global-stats-loading'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useLiquidityBarData } from './hooks'
import type { ChartEntry } from './types'

echarts.use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
])

interface LiquidityChartProps {
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency
  token1: EvmCurrency
  feeAmount: SushiSwapV3FeeAmount
}

export const LiquidityChart: FC<LiquidityChartProps> = ({
  chainId,
  token0,
  token1,
  feeAmount,
}) => {
  const {
    tickData: _tickData,
    isLoading,
    isError,
  } = useLiquidityBarData({
    chainId,
    token0,
    token1,
    feeAmount,
  })

  const tickData = _tickData?.barData

  const onMouseOver = useCallback(
    (params) => {
      const [token0Data, token1Data] = params as (CallbackDataParams & {
        data: number
      })[]

      const token0PriceNode = document.getElementById('token0Price')
      const token1PriceNode = document.getElementById('token1Price')

      const tick = tickData?.[token0Data.dataIndex].tick
      const token0Price = tickData?.[token0Data.dataIndex].price0
      const token1Price = tickData?.[token1Data.dataIndex].price1
      const amount0Locked = tickData?.[token0Data.dataIndex].amount0Locked
      const amount1Locked = tickData?.[token1Data.dataIndex].amount1Locked

      if (token0PriceNode) token0PriceNode.innerHTML = `${token0Price}`
      if (token1PriceNode) token1PriceNode.innerHTML = `${token1Price}`

      const tvl = token0Data.data + token1Data.data
      return `
            <div style="line-height:1.5">
            ${formatUSD(tvl)} <br/ >
              ${tick} <br/>
              <span style="color:#f472b6;">●</span> ${token0.symbol}: ${amount0Locked} (${formatUSD(token0Data.data)})<br/>
              <span style="color:#3b82f6;">●</span> ${token1.symbol}: ${amount1Locked} (${formatUSD(token1Data.data)})
              <br/> ${token0Price}
            </div>`
    },
    [tickData, token0.symbol, token1.symbol],
  ) satisfies TooltipFormatterCallback<TopLevelFormatterParams>

  // const onMouseLeave = useCallback(() => {
  //   const tvlNode = document.getElementById('hoveredTVL')
  //   const dateNode = document.getElementById('hoveredTVLDate')

  //   if (tvlNode) tvlNode.innerHTML = formatUSD(latestTvl)
  //   if (dateNode)
  //     dateNode.innerHTML = format(new Date(latestDate), 'dd MMM yyyy HH:mm aa')
  // }, [latestTvl, latestDate])

  const { data: prices } = usePrices({ chainId })

  const option = useMemo<EChartsOption>(() => {
    const token0PriceUSD = prices?.get(token0.wrap().address)
    const token1PriceUSD = prices?.get(token1.wrap().address)

    // const token0Data = token0PriceUSD
    //   ? (tickData?.map((d) => d.amount0Locked * token0PriceUSD) ?? [])
    //   : []
    // const token1Data = token1PriceUSD
    //   ? (tickData?.map((d) => d.amount1Locked * token1PriceUSD) ?? [])
    //   : []

    const activeTick = _tickData?.activeRangeData?.tick

    const token0Data = token0PriceUSD
      ? (tickData?.map((d) => {
          // below active => show token0; above active => zero; equal => keep both
          if (activeTick === undefined) return d.amount0Locked * token0PriceUSD
          if (d.tick < activeTick) return d.amount0Locked * token0PriceUSD
          if (d.tick > activeTick) return 0
          // d.tick === activeTick
          return d.amount0Locked * token0PriceUSD
        }) ?? [])
      : []

    const token1Data = token1PriceUSD
      ? (tickData?.map((d) => {
          // above active => show token1; below active => zero; equal => keep both
          if (activeTick === undefined) return d.amount1Locked * token1PriceUSD
          if (d.tick > activeTick) return d.amount1Locked * token1PriceUSD
          if (d.tick < activeTick) return 0
          // d.tick === activeTick
          return d.amount1Locked * token1PriceUSD
        }) ?? [])
      : []

    console.log(token0Data)
    console.log(token1Data)

    const totalBars = tickData?.length ?? 0
    const activeTickIndex =
      activeTick !== undefined && tickData
        ? tickData.findIndex((d) => d.tick === activeTick)
        : -1

    const WINDOW = 101 // visible bars; make it odd so active sits in the middle
    const half = Math.floor(WINDOW / 2)
    const defaultEnd = Math.min(totalBars - 1, WINDOW - 1)

    const startValue =
      activeTickIndex >= 0 ? Math.max(activeTickIndex - half, 0) : 0
    const endValue =
      activeTickIndex >= 0
        ? Math.min(activeTickIndex + half, totalBars - 1)
        : defaultEnd

    return {
      grid: { top: 0, left: 0, right: 0, bottom: 0 },
      tooltip: {
        trigger: 'axis',
        formatter: onMouseOver,
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          hideOverlap: true,
          // color: resolvedTheme === 'dark' ? 'white' : 'black',
          color: 'black',
          // formatter: (value: number, index: number) => {
          //   // const date = new Date(value)
          //   // const label = `${date.toLocaleString('en-US', {
          //   //   month: 'short',
          //   // })} ${date.getDate()}\n${date.getFullYear()}`

          //   // return index === 0
          //   //   ? `{min|${label}}`
          //   //   : value > tvlSeries.at(-2)?.[0]!
          //   //     ? `{max|${label}}`
          //   //     : label
          //   return 'test'
          // },
          padding: [0, 0, 0, 60],
          rich: {
            min: { padding: [0, 10, 0, 50] },
            max: { padding: [0, 50, 0, 10] },
          },
        },
      },
      yAxis: {
        show: false,
      },
      // ---------- NEW: zoom & scroll controls ----------
      dataZoom:
        totalBars > 0
          ? [
              {
                type: 'inside',
                xAxisIndex: 0,
                startValue,
                endValue,
                // wheel pans by default; hold Shift to zoom
                moveOnMouseWheel: true,
                zoomOnMouseWheel: 'shift',
                moveOnMouseMove: true,
                preventDefaultMouseMove: true,
                filterMode: 'none',
                zoomLock: false,
                throttle: 0,
              },
              {
                // hidden slider so programmatic windowing works even without UI
                type: 'slider',
                xAxisIndex: 0,
                startValue,
                endValue,
                show: false,
                filterMode: 'none',
              },
            ]
          : [],
      series: [
        {
          name: 'token0',
          type: 'bar',
          stack: 'liquidity',
          data: token0Data,
          barWidth: 3,
          itemStyle: { color: '#f472b6', opacity: 0.9 }, // pink
        },
        {
          name: 'token1',
          type: 'bar',
          stack: 'liquidity',
          data: token1Data,
          barWidth: 3,
          itemStyle: { color: '#3b82f6', opacity: 0.9 }, // blue
        },
      ],
    }
  }, [
    tickData,
    onMouseOver,
    prices,
    token0.wrap,
    token1.wrap,
    _tickData?.activeRangeData?.tick,
  ])

  return (
    <>
      <CardHeader>
        <CardTitle className="h-[22px]">
          <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-slate-300">
            <span>
              1 {token0.symbol} ={' '}
              <span id="token0Price">{_tickData?.activeRangeData?.price0}</span>{' '}
              {token1.symbol}
            </span>
            <span>
              1 {token1.symbol} ={' '}
              <span id="token1Price">{_tickData?.activeRangeData?.price1}</span>{' '}
              {token0.symbol}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonChart type="bar" />
        ) : isError ? (
          <div className="h-[400px] w-full" />
        ) : (
          <ReactEChartsCore
            echarts={echarts}
            option={option}
            style={{ height: 400 }}
          />
        )}
      </CardContent>
    </>
  )
}
