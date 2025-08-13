'use client'

import type {
  BladePool,
  V2Pool,
  V3Pool,
} from '@sushiswap/graph-client/data-api'
import {
  Button,
  Card,
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
import { useTheme } from 'next-themes'
import { useEffect, useMemo, useState } from 'react'
import { useCallback } from 'react'
import type { FC, MouseEventHandler, ReactNode } from 'react'
import type { SushiSwapProtocol } from 'sushi'
import { Native } from 'sushi/currency'
import { formatPercent } from 'sushi/format'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { Wrapper } from '../swap/trade/wrapper'
import { APRHoverCard } from './APRHoverCard'

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
  [PoolChartPeriod.SevenDay]: 86400 * 1000 * 7,
  [PoolChartPeriod.ThirtyDay]: 86400 * 1000 * 30,
  [PoolChartPeriod.ThreeMonth]: 86400 * 1000 * 90,
  [PoolChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const MOCK_APR_BUCKETS = {
  [PoolChartPeriod.SevenDay]: [
    { date: 1752259200, apr: 12.1 }, // 2025‑07‑11
    { date: 1752345600, apr: 11.8 }, // 2025‑07‑12
    { date: 1752432000, apr: 12.4 }, // 2025‑07‑13
    { date: 1752518400, apr: 11.9 }, // 2025‑07‑14
    { date: 1752604800, apr: 11.6 }, // 2025‑07‑15
    { date: 1752691200, apr: 12.3 }, // 2025‑07‑16
    { date: 1752777600, apr: 12.7 }, // 2025‑07‑17
    { date: 1752864000, apr: 12.5 }, // 2025‑07‑18
    { date: 1752950400, apr: 12.2 }, // 2025‑07‑19
    { date: 1753036800, apr: 11.5 }, // 2025‑07‑20
    { date: 1753123200, apr: 11.9 }, // 2025‑07‑21
    { date: 1753209600, apr: 12.0 }, // 2025‑07‑22
    { date: 1753296000, apr: 12.3 }, // 2025‑07‑23
    { date: 1753382400, apr: 12.6 }, // 2025‑07‑24
  ],
  [PoolChartPeriod.ThirtyDay]: [
    { date: 1752259200, apr: 12.1 }, // 2025‑07‑11
    { date: 1752345600, apr: 11.8 }, // 2025‑07‑12
    { date: 1752432000, apr: 12.4 }, // 2025‑07‑13
    { date: 1752518400, apr: 11.9 }, // 2025‑07‑14
    { date: 1752604800, apr: 11.6 }, // 2025‑07‑15
    { date: 1752691200, apr: 12.3 }, // 2025‑07‑16
    { date: 1752777600, apr: 12.7 }, // 2025‑07‑17
    { date: 1752864000, apr: 12.5 }, // 2025‑07‑18
    { date: 1752950400, apr: 12.2 }, // 2025‑07‑19
    { date: 1753036800, apr: 11.5 }, // 2025‑07‑20
    { date: 1753123200, apr: 11.9 }, // 2025‑07‑21
    { date: 1753209600, apr: 12.0 }, // 2025‑07‑22
    { date: 1753296000, apr: 12.3 }, // 2025‑07‑23
    { date: 1753382400, apr: 12.6 }, // 2025‑07‑24
    { date: 1753468800, apr: 12.4 }, // 2025‑07‑25
    { date: 1753555200, apr: 12.1 }, // 2025‑07‑26
    { date: 1753641600, apr: 11.8 }, // 2025‑07‑27
    { date: 1753728000, apr: 12.2 }, // 2025‑07‑28
    { date: 1753814400, apr: 12.5 }, // 2025‑07‑29
    { date: 1753900800, apr: 12.8 }, // 2025‑07‑30
    { date: 1753987200, apr: 13.0 }, // 2025‑07‑31
    { date: 1754073600, apr: 12.9 }, // 2025‑08‑01
    { date: 1754160000, apr: 12.6 }, // 2025‑08‑02
    { date: 1754246400, apr: 12.4 }, // 2025‑08‑03
    { date: 1754332800, apr: 12.2 }, // 2025‑08‑04
    { date: 1754419200, apr: 12.0 }, // 2025‑08‑05
    { date: 1754505600, apr: 11.7 }, // 2025‑08‑06
    { date: 1754592000, apr: 11.9 }, // 2025‑08‑07
    { date: 1754678400, apr: 12.1 }, // 2025‑08‑08
    { date: 1754764800, apr: 12.3 }, // 2025‑08‑09
    { date: 1754851200, apr: 12.5 }, // 2025‑08‑10
    { date: 1754937600, apr: 12.7 }, // 2025‑08‑11
    { date: 1755024000, apr: 12.9 }, // 2025‑08‑12
    { date: 1755110400, apr: 13.1 }, // 2025‑08‑13
    { date: 1755196800, apr: 13.3 }, // 2025‑08‑14
    { date: 1755283200, apr: 13.5 }, // 2025‑08‑15
    { date: 1755369600, apr: 13.7 }, // 2025‑08‑16
    { date: 1755456000, apr: 13.9 }, // 2025‑08‑17
    { date: 1755542400, apr: 14.1 }, // 2025‑08‑18
    { date: 1755628800, apr: 14.3 }, // 2025‑08‑19
  ],
  [PoolChartPeriod.ThreeMonth]: [
    { date: 1752259200, apr: 12.1 }, // 2025‑07‑11
    { date: 1752345600, apr: 11.8 }, // 2025‑07‑12

    { date: 1754419200, apr: 12.0 }, // 2025‑08‑05
    { date: 1754505600, apr: 11.7 }, // 2025‑08‑06
    { date: 1754592000, apr: 11.9 }, // 2025‑08‑07
    { date: 1754678400, apr: 12.1 }, // 2025‑08‑08

    { date: 1756147200, apr: 15.5 }, // 2025‑08‑25
    { date: 1756233600, apr: 15.7 }, // 2025‑08‑26
    { date: 1756320000, apr: 15.9 }, // 2025‑08‑27
    { date: 1756406400, apr: 16.1 }, // 2025‑08‑28
    { date: 1756492800, apr: 16.3 }, // 2025‑08‑29
    { date: 1756579200, apr: 16.5 }, // 2025‑08‑30
    { date: 1756665600, apr: 16.7 }, // 2025‑08‑31
    { date: 1756752000, apr: 16.9 }, // 2025‑09‑01
    { date: 1756838400, apr: 17.1 }, // 2025‑09‑02
    { date: 1756924800, apr: 17.3 }, // 2025‑09‑03
    { date: 1757011200, apr: 17.5 }, // 2025‑09‑04
    { date: 1757097600, apr: 17.7 }, // 2025‑09‑05
    { date: 1757184000, apr: 17.9 }, // 2025‑09‑06
    { date: 1757270400, apr: 18.1 }, // 2025‑09‑07

    { date: 1758652800, apr: 21.3 }, // 2025‑09‑23
    { date: 1758739200, apr: 21.5 }, // 2025‑09‑24
    { date: 1758825600, apr: 21.7 }, // 2025‑09‑25
    { date: 1758912000, apr: 21.9 }, // 2025‑09‑26
    { date: 1758998400, apr: 22.1 }, // 2025‑09‑27
    { date: 1759084800, apr: 22.3 }, // 2025‑09‑28
    { date: 1759171200, apr: 22.5 }, // 2025‑09‑29
    { date: 1759257600, apr: 22.7 }, // 2025‑09‑30
    { date: 1759344000, apr: 22.9 }, // 2025‑10‑01
    { date: 1759430400, apr: 23.1 }, // 2025‑10‑02
    { date: 1759516800, apr: 23.3 }, // 2025‑10‑03
    { date: 1759603200, apr: 23.5 }, // 2025‑10‑04
    { date: 1759689600, apr: 23.7 }, // 2025‑10‑05
    { date: 1759776000, apr: 23.9 }, // 2025‑10‑06
    { date: 1759862400, apr: 24.1 }, // 2025‑10‑07
    { date: 1759948800, apr: 24.3 }, // 2025‑10‑08
    { date: 1760035200, apr: 24.5 }, // 2025‑10‑09
    { date: 1760121600, apr: 24.7 }, // 2025‑10‑10
    { date: 1760208000, apr: 24.9 }, // 2025‑10‑11
    { date: 1760294400, apr: 25.1 }, // 2025‑10‑12

    { date: 1761417600, apr: 27.7 }, // 2025‑10‑25
    { date: 1761504000, apr: 27.9 }, // 2025‑10‑26
    { date: 1761590400, apr: 28.1 }, // 2025‑10‑27
    { date: 1761676800, apr: 28.3 }, // 2025‑10‑28
    { date: 1761763200, apr: 28.5 }, // 2025‑10‑29
    { date: 1761849600, apr: 28.7 }, // 2025‑10‑30
    { date: 1761936000, apr: 28.9 }, // 2025‑10‑31
  ],
  [PoolChartPeriod.All]: [
    // July 2025
    { date: 1752259200, apr: 12.1 }, // Jul 11
    { date: 1752518400, apr: 12.4 }, // Jul 14
    { date: 1752864000, apr: 12.6 }, // Jul 18
    { date: 1753123200, apr: 12.9 }, // Jul 21
    { date: 1753382400, apr: 13.2 }, // Jul 24

    // August 2025
    { date: 1753747200, apr: 13.5 }, // Aug 1
    { date: 1754073600, apr: 13.9 }, // Aug 5
    { date: 1754419200, apr: 14.3 }, // Aug 9
    { date: 1754755200, apr: 14.6 }, // Aug 13
    { date: 1755091200, apr: 14.9 }, // Aug 17
    { date: 1755379200, apr: 15.2 }, // Aug 20
    { date: 1755715200, apr: 15.6 }, // Aug 24
    { date: 1755974400, apr: 15.8 }, // Aug 27

    // September 2025
    { date: 1756320000, apr: 16.1 }, // Sep 1
    { date: 1756579200, apr: 16.4 }, // Sep 4
    { date: 1756924800, apr: 16.9 }, // Sep 8
    { date: 1757260800, apr: 17.3 }, // Sep 12
    { date: 1757596800, apr: 17.8 }, // Sep 16
    { date: 1757856000, apr: 18.2 }, // Sep 19
    { date: 1758124800, apr: 18.7 }, // Sep 22
    { date: 1758384000, apr: 19.1 }, // Sep 25
    { date: 1758643200, apr: 19.5 }, // Sep 28

    // October 2025
    { date: 1758912000, apr: 20.0 }, // Oct 1
    { date: 1759171200, apr: 20.4 }, // Oct 4
    { date: 1759507200, apr: 20.9 }, // Oct 8
    { date: 1759766400, apr: 21.3 }, // Oct 11
    { date: 1760025600, apr: 21.7 }, // Oct 14
    { date: 1760371200, apr: 22.2 }, // Oct 18
    { date: 1760630400, apr: 22.5 }, // Oct 21
    { date: 1760899200, apr: 22.9 }, // Oct 24
    { date: 1761158400, apr: 23.3 }, // Oct 27
    { date: 1761417600, apr: 23.6 }, // Oct 30

    // November 2025
    { date: 1761676800, apr: 23.9 }, // Nov 2
    { date: 1761936000, apr: 24.2 }, // Nov 5
    { date: 1762195200, apr: 24.5 }, // Nov 8
    { date: 1762454400, apr: 24.9 }, // Nov 11
    { date: 1762800000, apr: 25.3 }, // Nov 15
    { date: 1763059200, apr: 25.6 }, // Nov 18
    { date: 1763318400, apr: 25.9 }, // Nov 21
    { date: 1763577600, apr: 26.3 }, // Nov 24
    { date: 1763836800, apr: 26.7 }, // Nov 27

    // December 2025
    { date: 1764096000, apr: 27.0 }, // Dec 1
    { date: 1764355200, apr: 27.4 }, // Dec 4
    { date: 1764614400, apr: 27.7 }, // Dec 7
    { date: 1764873600, apr: 28.0 }, // Dec 10
    { date: 1765132800, apr: 28.3 }, // Dec 13
    { date: 1765392000, apr: 28.7 }, // Dec 16
    { date: 1765651200, apr: 29.1 }, // Dec 19
    { date: 1765910400, apr: 29.5 }, // Dec 22
    { date: 1766169600, apr: 29.9 }, // Dec 25
    { date: 1766342400, apr: 30.2 }, // Dec 27
    { date: 1766438400, apr: 30.5 }, // Dec 28
    { date: 1766524800, apr: 30.9 }, // Dec 29
  ],
}

const tailwind = resolveConfig(tailwindConfig)

export const APRChart = ({ pool }: { pool: BladePool | V2Pool | V3Pool }) => {
  const [period, setPeriod] = useState<PoolChartPeriod>(
    PoolChartPeriod.ThirtyDay,
  )
  const [isLoading, setIsLoading] = useState(true)
  const isError = false
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => setIsLoading(false), [])

  const buckets = MOCK_APR_BUCKETS[period]
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

  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valNode = document.querySelector<HTMLElement>('.aprHoveredValue')
      const dateNode = document.querySelector<HTMLElement>('.aprHoveredDate')
      if (valNode) valNode.textContent = `${value.toFixed(2)}%`
      if (dateNode)
        dateNode.textContent = format(new Date(name * 1000), 'dd MMM yyyy')
    },
    [],
  )

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

          onMouseOver({
            name: timestamp,
            value: typeof value === 'number' ? value : Number(value) || 0,
          })

          const date = new Date(timestamp)
          return `<div class="flex flex-col gap-0.5 paper bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-xl overflow-hidden shadow-lg">
            <span class="text-sm font-medium text-gray-900 dark:text-slate-50">${value}%</span>
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
    [xData, yData, onMouseOver, period, isDark],
  )

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader>
        <CardTitle className="">
          <div className="flex justify-between items-center">
            <APRHoverCard
              pool={{
                isIncentivized: false,
                address: pool.address,
                chainId: pool.chainId,
                id: pool.id,
                protocol: pool.protocol as SushiSwapProtocol,
                feeApr1d: pool.feeApr1d,
                incentiveApr: 0,
                wasIncentivized: false,
              }}
            >
              <div className="flex flex-col gap-1">
                {/* @DEV TODO use APRHoverCard component instead */}

                <span className="text-sm !font-medium text-muted-foreground">
                  APR
                </span>
                <div className="hidden gap-1 items-center lg:flex">
                  <span className="text-base lg:text-[1.75rem] font-medium underline decoration-dotted underline-offset-[5px] text-slate-900 dark:text-slate-100">
                    {formatPercent(pool.feeApr1d)}
                  </span>
                  <Currency.IconList
                    iconWidth={26}
                    iconHeight={26}
                    className="!border-none"
                  >
                    <Currency.Icon currency={Native.onChain(1)} />
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
            <Currency.Icon currency={Native.onChain(1)} />
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
