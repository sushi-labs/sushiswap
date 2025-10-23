'use client'

import type { RawV2Pool, RawV3Pool } from '@sushiswap/graph-client/data-api'
import type { V2PoolBuckets } from '@sushiswap/graph-client/data-api'
import {
  Button,
  CardContent,
  CardHeader,
  CardTitle,
  Currency,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import format from 'date-fns/format'
import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import ms from 'ms'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import type { FC, MouseEventHandler, ReactNode } from 'react'
import { usePoolBuckets } from 'src/lib/hooks/api/use-pool-buckets'
import { ChainId, formatPercent } from 'sushi'
import { SUSHI } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { Wrapper } from '../[trade]/_ui/swap/trade/wrapper'
import { APRHoverCard } from './apr-hover-card'

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
])

export enum PoolChartPeriod {
  SevenDay = 'SevenDay',
  ThirtyDay = 'ThirtyDay',
  ThreeMonth = 'ThreeMonth',
  All = 'All',
}

export const chartPeriods: Record<PoolChartPeriod, number> = {
  [PoolChartPeriod.SevenDay]: ms('7d'),
  [PoolChartPeriod.ThirtyDay]: ms('30d'),
  [PoolChartPeriod.ThreeMonth]: ms('90d'),
  [PoolChartPeriod.All]: Number.POSITIVE_INFINITY,
}

const tailwind = resolveConfig(tailwindConfig)

const formatBucketData = (
  bucketData: V2PoolBuckets,
  period: PoolChartPeriod,
) => {
  const now = Date.now()
  switch (period) {
    case PoolChartPeriod.SevenDay:
      return bucketData.hourBuckets
        .filter((bucket) => bucket.date * 1000 >= now - chartPeriods[period])
        .map((bucket) => ({ date: bucket.date, apr: bucket.apr }))
    case PoolChartPeriod.ThirtyDay:
      return bucketData.dayBuckets
        .filter((bucket) => bucket.date * 1000 >= now - chartPeriods[period])
        .map((bucket) => ({ date: bucket.date, apr: bucket.apr }))
    case PoolChartPeriod.ThreeMonth:
      return bucketData.dayBuckets
        .filter((bucket) => bucket.date * 1000 >= now - chartPeriods[period])
        .map((bucket) => ({ date: bucket.date, apr: bucket.apr }))
    case PoolChartPeriod.All:
      return bucketData.dayBuckets.map((bucket) => ({
        date: bucket.date,
        apr: bucket.apr,
      }))
    default:
      return []
  }
}

interface APRChartProps {
  pool: RawV2Pool | RawV3Pool
}

export const APRChart: FC<APRChartProps> = ({ pool }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [period, setPeriod] = useState<PoolChartPeriod>(
    PoolChartPeriod.ThirtyDay,
  )
  const {
    data: bucketData,
    isLoading,
    isError,
  } = usePoolBuckets({
    chainId: pool.chainId,
    poolAddress: pool.address,
    protocol: pool.protocol,
  })

  const buckets = useMemo(() => {
    if (!bucketData) return []
    return formatBucketData(bucketData, period)
  }, [bucketData, period])

  const [xData, yData]: [number[], number[]] = useMemo(() => {
    const source = buckets || []

    const now = Date.now()
    const [x, y] = source.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur?.date * 1000 >= now - chartPeriods[period]) {
          acc[0].push(cur.date)

          const apr = cur.apr
          acc[1].push(apr)
        }
        return acc
      },
      [[], []],
    )

    return [x.reverse(), y.reverse()]
  }, [buckets, period])

  const formatLabel = (date: Date, period: PoolChartPeriod): string => {
    switch (period) {
      case PoolChartPeriod.SevenDay:
        return format(date, 'EEE')
      case PoolChartPeriod.ThirtyDay:
        return format(date, 'd MMM')
      case PoolChartPeriod.ThreeMonth:
        return format(date, "MMM ''yy")
      case PoolChartPeriod.All:
        return format(date, "MMM ''yy")
      default:
        return ''
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const option = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText:
          'z-index: 1000; padding: 0 !important; box-shadow: none !important',
        responsive: true,
        // @ts-ignore
        backgroundColor: 'transparent',
        textStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        axisPointer: {
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: (params: any) => {
          const [timestamp, value] = Array.isArray(params[0].value)
            ? params[0].value
            : [params[0].name, params[0].value]

          const date = new Date(timestamp)
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm font-medium text-gray-900 dark:text-slate-50">${formatPercent(
              value / 100,
            )}</span>
            <span class="text-xs font-medium text-gray-500 dark:text-slate-400">${
              date instanceof Date && !Number.isNaN(date?.getTime())
                ? format(
                    date,
                    `dd MMM yyyy${chartPeriods[period] < chartPeriods[PoolChartPeriod.SevenDay] ? ' p' : ''}`,
                  )
                : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      grid: { top: 0, left: 0, right: 0, bottom: 40 },
      color: [
        isDark
          ? (tailwind.theme?.colors?.skyblue as Record<string, string>)['500']
          : (tailwind.theme?.colors?.blue as Record<string, string>)['500'],
      ],
      xAxis: [
        {
          type: 'time',
          show: true,
          boundaryGap: false,
          splitNumber:
            period === PoolChartPeriod.SevenDay
              ? 6
              : period === PoolChartPeriod.ThirtyDay
                ? 7
                : period === PoolChartPeriod.ThreeMonth
                  ? 4
                  : period === PoolChartPeriod.All
                    ? 6
                    : 5,
          axisLabel: {
            formatter: (value: number) => formatLabel(new Date(value), period),
            color: (tailwind.theme?.colors?.slate as Record<string, string>)[
              '450'
            ],
            fontWeight: 600,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],

      yAxis: [
        {
          type: 'value',
          show: false,
          min: Math.min(...yData) - 1,
          max: Math.max(...yData) + 1,
        },
      ],
      series: [
        {
          type: 'line',
          showSymbol: false,
          smooth: true,
          lineStyle: { width: 2 },
          data: xData.map((x, i) => [x * 1000, yData[i]]),
        },
      ],
    }),
    [xData, yData, period, isDark],
  )

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader>
        <CardTitle className="">
          <div className="flex justify-between items-center">
            <APRHoverCard pool={pool}>
              <div className="flex flex-col gap-1">
                <span className="text-sm !font-medium text-muted-foreground">
                  APR
                </span>
                <div className="hidden gap-1 items-center lg:flex">
                  <span className="text-base lg:text-[1.75rem] font-medium underline decoration-dotted underline-offset-[5px] text-slate-900 dark:text-slate-100">
                    {formatPercent(pool.totalApr1d / 100)}
                  </span>
                  <Currency.IconList
                    iconWidth={26}
                    iconHeight={26}
                    className="!border-none"
                  >
                    {pool?.incentives?.map((i) => {
                      return (
                        <Currency.Icon
                          key={i.rewardToken.address}
                          currency={
                            new EvmToken({
                              chainId: i.rewardToken.chainId,
                              address: i.rewardToken.address,
                              decimals: i.rewardToken.decimals,
                              symbol: i.rewardToken.symbol,
                              name: i.rewardToken.name,
                            })
                          }
                        />
                      )
                    })}
                  </Currency.IconList>
                </div>
              </div>
            </APRHoverCard>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <ChartPeriodButton
                  active={period === PoolChartPeriod.SevenDay}
                  onClick={() => setPeriod(PoolChartPeriod.SevenDay)}
                >
                  7d
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === PoolChartPeriod.ThirtyDay}
                  onClick={() => setPeriod(PoolChartPeriod.ThirtyDay)}
                >
                  30d
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === PoolChartPeriod.ThreeMonth}
                  onClick={() => setPeriod(PoolChartPeriod.ThreeMonth)}
                >
                  3mo
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === PoolChartPeriod.All}
                  onClick={() => setPeriod(PoolChartPeriod.All)}
                >
                  All
                </ChartPeriodButton>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!pb-0">
        <div className="flex gap-1 items-center lg:hidden">
          <span className="text-base lg:text-[1.75rem] font-medium underline decoration-dotted underline-offset-4">
            12.3%
          </span>
          <Currency.IconList
            iconWidth={20}
            iconHeight={20}
            className="!border-none"
          >
            <Currency.Icon currency={SUSHI[ChainId.ETHEREUM]} />
          </Currency.IconList>
        </div>
        {isLoading ? (
          <SkeletonBox
            className={classNames(
              'w-full h-[134px] !mb-4 dark:via-slate-800 dark:to-slate-900',
            )}
          />
        ) : isError ? (
          <div className="h-[134px] !mb-4 w-full" />
        ) : (
          <ReactEchartsCore
            echarts={echarts}
            option={option}
            style={{ height: 150 }}
          />
        )}
      </CardContent>
    </Wrapper>
  )
}

interface ChartPeriodButtonProps {
  active: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
  children: ReactNode
}

export const ChartPeriodButton: FC<ChartPeriodButtonProps> = ({
  active,
  onClick,
  children,
}) => {
  return (
    <Button
      size="sm"
      variant={active ? 'tertiary' : 'ghost'}
      onClick={onClick}
      className={classNames('h-8 w-[50px]', !active && '!font-normal')}
    >
      {children}
    </Button>
  )
}
