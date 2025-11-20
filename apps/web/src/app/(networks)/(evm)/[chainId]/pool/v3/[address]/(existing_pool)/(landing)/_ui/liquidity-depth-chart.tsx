'use client'

import {
  SkeletonBox,
  Toggle,
  classNames,
  cloudinaryLogoImageLoader,
} from '@sushiswap/ui'
import ReactECharts from 'echarts-for-react'
import { useTheme } from 'next-themes'
import React, { type FC, useMemo, useState } from 'react'
import { useConcentratedLiquidityPoolStats } from 'src/lib/hooks/react-query'
import { Amount, formatPercent, formatUSD } from 'sushi'
import {
  type EvmCurrency,
  type SushiSwapV3ChainId,
  unwrapEvmToken,
} from 'sushi/evm'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import type { Address } from 'viem'
import { useDensityChartData } from '~evm/[chainId]/_ui/LiquidityChartRangeInput/hooks'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { DepthZoomType } from './statistics-chart-v3'

interface LiquidityDepthChart {
  address: Address
  chainId: SushiSwapV3ChainId
  zoomRange: DepthZoomType
}
const tailwind = resolveConfig(tailwindConfig)

const getIconSrc = (currency: EvmCurrency) => {
  return `tokens/${currency.chainId}/${currency.wrap().address}.jpg`
}

export const LiquidityDepthChart: FC<LiquidityDepthChart> = ({
  address,
  chainId,
  zoomRange,
}) => {
  const { data: priceMap } = usePrices({ chainId: chainId })
  const [invertPrice, setInvertPrice] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const { data: poolStats } = useConcentratedLiquidityPoolStats({
    chainId,
    address,
  })

  const { price, noLiquidity } = useConcentratedDerivedMintInfo({
    account: undefined,
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    baseToken: poolStats?.token0,
    feeAmount: poolStats?.feeAmount,
    existingPosition: undefined,
  })

  const { isLoading, data } = useDensityChartData({
    chainId,
    token0: poolStats?.token0,
    token1: poolStats?.token1,
    feeAmount: poolStats?.feeAmount,
  })

  const current = useMemo(() => {
    if (!price) return null

    return Number.parseFloat(
      (invertPrice ? price.invert() : price)?.toSignificant(8),
    )
  }, [invertPrice, price])

  const { prices, depths } = useMemo(() => {
    const prices = data?.map((d) => d.price0.toFixed(6))
    const depths = data?.map((d) => d.activeLiquidity)
    return { prices, depths }
  }, [data])

  const { token0Usd, token1Usd } = useMemo(() => {
    if (!priceMap || !poolStats) return { token0Usd: 0, token1Usd: 0 }
    const token0Address = poolStats?.token0.wrap().address
    const token1Address = poolStats?.token1.wrap().address

    return {
      token0Usd: token0Address ? (priceMap?.get(token0Address) ?? 0) : 0,
      token1Usd: token1Address ? (priceMap?.get(token1Address) ?? 0) : 0,
    }
  }, [poolStats, priceMap])

  const { token0, token1 } = useMemo(() => {
    return {
      token0: poolStats?.token0 ? unwrapEvmToken(poolStats?.token0) : undefined,
      token1: poolStats?.token1 ? unwrapEvmToken(poolStats?.token1) : undefined,
    }
  }, [poolStats])

  const option = useMemo(
    () => ({
      grid: {
        left: 40,
        right: 20,
        top: 20,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: prices,
        boundaryGap: true,
        axisLabel: {
          color: (tailwind.theme?.colors?.slate as Record<string, string>)[
            '450'
          ],
          fontWeight: 500,
          fontSize: 14,
          formatter: (val: string) => Number(val).toFixed(4),
        },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLabel: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        extraCssText:
          'z-index: 1000; padding: 0 !important; box-shadow: none !important;',
        responsive: true,
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 14,
          fontWeight: 400,
        },
        formatter: (params: any) => {
          const p = params[0]
          const price0 = Number.parseFloat(p.name)
          const price1 = price0 === 0 ? 0 : 1 / price0
          // const activeLiquidity = Number(p.value)
          if (!token0 || !token1 || !poolStats) return ''
          const reserve0 = new Amount(token0, poolStats?.reserve0)
          const reserve1 = new Amount(token1, poolStats?.reserve1)

          const token0UsdAmount = reserve0.mulHuman(token0Usd)
          const token1UsdAmount = reserve1.mulHuman(token1Usd)

          const usd0 = Number(token0UsdAmount.toString())
          const usd1 = Number(token1UsdAmount.toString())
          const totalUsd = usd0 + usd1

          const percent0 = totalUsd === 0 ? 0 : usd0 / totalUsd
          const percent1 = totalUsd === 0 ? 0 : usd1 / totalUsd

          const token0Symbol = token0?.symbol
          const token1Symbol = token1?.symbol

          const icon0Src = cloudinaryLogoImageLoader({
            src: token0 ? getIconSrc(token0) : '',
            width: 50,
          })
          const icon1Src = cloudinaryLogoImageLoader({
            src: token1 ? getIconSrc(token1) : '',
            width: 50,
          })

          const line1 =
            price0 !== null
              ? `1 ${token0Symbol} = ${price0.toFixed(6)} ${token1Symbol}`
              : '-'

          const line2 =
            price0 !== null && price0 !== 0
              ? `1 ${token1Symbol} = ${price1.toFixed(6)} ${token0Symbol}`
              : '-'

          return `<div class="flex text-sm dark:!text-pink-100 !text-[#0C0C23] min-w-[270px] flex-col paper gap-4 bg-white/[.14] dark:bg-slate-800/[.14] p-4 shadow-sm border border-accent rounded-lg">
                    <div class="flex flex-col gap-1">
                      <div class="!font-[500]">Ticker Price</div>
                      <div>${line1}</div>
                      <div>${line2}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1">
                          <img src="${icon0Src}" width="20" height="20" class="rounded-full" />
                          ${token0Symbol}
                        </div>
                        <div class="flex items-center gap-1">
                          <div>${formatUSD(usd0)}</div>
                          <div class="dark:text-slate-300 text-slate-450">${formatPercent(percent0)}</div>
                        </div>
                      </div>
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1">
                          <img src="${icon1Src}" width="20" height="20" class="rounded-full" />
                          ${token1Symbol}
                        </div>
                        <div class="flex items-center gap-1">
                          <div>${formatUSD(usd1)}</div>
                          <div class="dark:text-slate-300 text-slate-450">${formatPercent(percent1)}</div>
                        </div>
                      </div>
                    </div>
                  </div>`
        },
        borderWidth: 0,
      },
      dataZoom: [
        {
          type: 'inside',
          start: zoomRange.start,
          end: zoomRange.end,
        },
      ],
      series: [
        {
          type: 'bar',
          data: depths,
          barWidth: 3,
          itemStyle: {
            color: isDark
              ? (tailwind.theme?.colors?.skyblue as Record<string, string>)[
                  '500'
                ]
              : (tailwind.theme?.colors?.blue as Record<string, string>)['500'],
            opacity: 0.55,
          },
          emphasis: { itemStyle: { opacity: 1 } },
        },
      ],
    }),
    [
      prices,
      depths,
      zoomRange,
      isDark,
      poolStats,
      token0,
      token1,
      token0Usd,
      token1Usd,
    ],
  )

  return (
    <div className="flex flex-col gap-2">
      {isLoading ? (
        <SkeletonBox className={classNames('my-6 h-[353px] w-[95%] mx-auto')} />
      ) : !noLiquidity && !isLoading && data && current && poolStats ? (
        <>
          <div className="p-4 flex items-center gap-2 flex-wrap font-[500] text-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue dark:bg-skyblue w-[8px] h-[8px] min-w-[8px] min-h-[8px]" />
              Current Price: 1 {invertPrice ? token1?.symbol : token0?.symbol} ={' '}
              {current} {invertPrice ? token0?.symbol : token1?.symbol} (
              {formatUSD(invertPrice ? token0Usd : token1Usd)})
            </div>
            <div className="flex items-center gap-1">
              <Toggle
                variant="outline"
                size="xs"
                pressed={!invertPrice}
                onClick={() => setInvertPrice(!invertPrice)}
                key={'token0'}
              >
                {token0?.symbol}
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={invertPrice}
                onClick={() => setInvertPrice(!invertPrice)}
                key={'token1'}
              >
                {token1?.symbol}
              </Toggle>
            </div>
          </div>

          <ReactECharts
            option={option}
            style={{ width: '100%', height: 334 }}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-[353px] w-full text-xs font-[500] italic opacity-80">
          No Liquidity Data Available
        </div>
      )}
    </div>
  )
}
