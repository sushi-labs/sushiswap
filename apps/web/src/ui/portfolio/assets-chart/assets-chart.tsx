'use client'

import { useIsSmScreen } from '@sushiswap/hooks'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import type { Type } from 'sushi/currency'
import { formatUSD } from 'sushi/format'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { Wrapper } from '../../swap/trade/wrapper'
import { ActionButtons } from './action-buttons'
import { AssetsFilter } from './assets-filter'

echarts.use([
  CanvasRenderer,
  BarChart,
  LineChart,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
])

export enum AssetsChartPeriod {
  OneDay = 'OneDay',
  SevenDay = 'SevenDay',
  ThirtyDay = 'ThirtyDay',
  All = 'All',
}

export const chartPeriods: Record<AssetsChartPeriod, number> = {
  [AssetsChartPeriod.OneDay]: 86400 * 1000 * 1,
  [AssetsChartPeriod.SevenDay]: 86400 * 1000 * 7,
  [AssetsChartPeriod.ThirtyDay]: 86400 * 1000 * 30,
  [AssetsChartPeriod.All]: Number.POSITIVE_INFINITY,
}

export const MOCK_USD_VALUE_BUCKETS = {
  [AssetsChartPeriod.OneDay]: [
    { date: 1757625600, usdValue: 9500 },
    { date: 1757632800, usdValue: 9680 },
    { date: 1757640000, usdValue: 9400 },
    { date: 1757647200, usdValue: 9850 },
    { date: 1757661600, usdValue: 10020 },
    { date: 1757668800, usdValue: 9720 },
    { date: 1757676000, usdValue: 10110 },
    { date: 1757697600, usdValue: 9950 },
    { date: 1757704800, usdValue: 10420 },
    { date: 1757719200, usdValue: 10780 },
    { date: 1757726400, usdValue: 10360 },
    { date: 1757733600, usdValue: 11050 },
    { date: 1757748000, usdValue: 10840 },
    { date: 1757755200, usdValue: 11220 },
    { date: 1757762400, usdValue: 10970 },
    { date: 1757769600, usdValue: 11500 },
    { date: 1757776800, usdValue: 11120 },
    { date: 1757784000, usdValue: 11740 },
    { date: 1757791200, usdValue: 11380 },
  ],
  [AssetsChartPeriod.SevenDay]: [
    { date: 1757635200, usdValue: 1000 },
    { date: 1757721600, usdValue: 1010 },
    { date: 1757808000, usdValue: 1022 },
    { date: 1757894400, usdValue: 1033 },
    { date: 1757980800, usdValue: 1045 },
    { date: 1758067200, usdValue: 1058 },
    { date: 1758153600, usdValue: 1070 },
    { date: 1758240000, usdValue: 1082 },
    { date: 1758326400, usdValue: 1095 },
    { date: 1758412800, usdValue: 1107 },
    { date: 1758499200, usdValue: 1120 },
    { date: 1758585600, usdValue: 1133 },
    { date: 1758672000, usdValue: 1146 },
    { date: 1758758400, usdValue: 1160 },
  ],
  [AssetsChartPeriod.ThirtyDay]: [
    { date: 1752259200, usdValue: 1000 },
    { date: 1752345600, usdValue: 1012 },
    { date: 1752432000, usdValue: 1024 },
    { date: 1752518400, usdValue: 1036 },
    { date: 1752604800, usdValue: 1048 },
    { date: 1752691200, usdValue: 1061 },
    { date: 1752777600, usdValue: 1073 },
    { date: 1752864000, usdValue: 1086 },
    { date: 1752950400, usdValue: 1099 },
    { date: 1753036800, usdValue: 1111 },
    { date: 1753123200, usdValue: 1124 },
    { date: 1753209600, usdValue: 1137 },
    { date: 1753296000, usdValue: 1151 },
    { date: 1753382400, usdValue: 1165 },
    { date: 1753468800, usdValue: 1179 },
    { date: 1753555200, usdValue: 1193 },
    { date: 1753641600, usdValue: 1207 },
    { date: 1753728000, usdValue: 1221 },
    { date: 1753814400, usdValue: 1236 },
    { date: 1753900800, usdValue: 1251 },
    { date: 1753987200, usdValue: 1266 },
    { date: 1754073600, usdValue: 1281 },
    { date: 1754160000, usdValue: 1296 },
    { date: 1754246400, usdValue: 1311 },
    { date: 1754332800, usdValue: 1326 },
    { date: 1754419200, usdValue: 1341 },
    { date: 1754505600, usdValue: 1356 },
    { date: 1754592000, usdValue: 1371 },
    { date: 1754678400, usdValue: 1386 },
    { date: 1754764800, usdValue: 1401 },
    { date: 1754851200, usdValue: 1416 },
    { date: 1754937600, usdValue: 1431 },
    { date: 1755024000, usdValue: 1446 },
    { date: 1755110400, usdValue: 1461 },
    { date: 1755196800, usdValue: 1476 },
    { date: 1755283200, usdValue: 1491 },
    { date: 1755369600, usdValue: 1506 },
    { date: 1755456000, usdValue: 1521 },
    { date: 1755542400, usdValue: 1536 },
    { date: 1755628800, usdValue: 1551 },
  ],
  [AssetsChartPeriod.All]: [
    { date: 1752259200, usdValue: 1000 },
    { date: 1752518400, usdValue: 1036 },
    { date: 1752864000, usdValue: 1086 },
    { date: 1753123200, usdValue: 1124 },
    { date: 1753382400, usdValue: 1165 },
    { date: 1753747200, usdValue: 1208 },
    { date: 1754073600, usdValue: 1281 },
    { date: 1754419200, usdValue: 1341 },
    { date: 1754755200, usdValue: 1410 },
    { date: 1755091200, usdValue: 1480 },
    { date: 1755379200, usdValue: 1552 },
    { date: 1755715200, usdValue: 1614 },
    { date: 1755974400, usdValue: 1659 },
    { date: 1756320000, usdValue: 1718 },
    { date: 1756579200, usdValue: 1775 },
    { date: 1756924800, usdValue: 1854 },
    { date: 1757260800, usdValue: 1935 },
    { date: 1757596800, usdValue: 2020 },
    { date: 1757856000, usdValue: 2105 },
    { date: 1758124800, usdValue: 2198 },
    { date: 1758384000, usdValue: 2290 },
    { date: 1758643200, usdValue: 2383 },
    { date: 1758912000, usdValue: 2480 },
    { date: 1759171200, usdValue: 2575 },
    { date: 1759507200, usdValue: 2684 },
    { date: 1759766400, usdValue: 2780 },
    { date: 1760025600, usdValue: 2877 },
    { date: 1760371200, usdValue: 2990 },
    { date: 1760630400, usdValue: 3070 },
    { date: 1760899200, usdValue: 3168 },
    { date: 1761158400, usdValue: 3265 },
    { date: 1761417600, usdValue: 3362 },
    { date: 1761676800, usdValue: 3456 },
    { date: 1761936000, usdValue: 3550 },
    { date: 1762195200, usdValue: 3645 },
    { date: 1762454400, usdValue: 3743 },
    { date: 1762800000, usdValue: 3852 },
    { date: 1763059200, usdValue: 3938 },
    { date: 1763318400, usdValue: 4025 },
    { date: 1763577600, usdValue: 4123 },
    { date: 1763836800, usdValue: 4225 },
    { date: 1764096000, usdValue: 4322 },
    { date: 1764355200, usdValue: 4420 },
    { date: 1764614400, usdValue: 4517 },
    { date: 1764873600, usdValue: 4614 },
    { date: 1765132800, usdValue: 4711 },
    { date: 1765392000, usdValue: 4808 },
    { date: 1765651200, usdValue: 4906 },
    { date: 1765910400, usdValue: 5003 },
    { date: 1766169600, usdValue: 5100 },
    { date: 1766342400, usdValue: 5150 },
    { date: 1766438400, usdValue: 5200 },
    { date: 1766524800, usdValue: 5250 },
  ],
}

const tailwind = resolveConfig(tailwindConfig)

export const AssetsChart = () => {
  const [selectedToken, setSelectedToken] = useState<Type | null>(null)

  const [period, setPeriod] = useState<AssetsChartPeriod>(
    AssetsChartPeriod.OneDay,
  )
  const [isLoading, setIsLoading] = useState(true)
  const isError = false
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const isSmallScreen = useIsSmScreen()

  useEffect(() => setIsLoading(false), [])

  const buckets = MOCK_USD_VALUE_BUCKETS[period]
  const [xData, yData]: [number[], number[]] = useMemo(() => {
    const source = buckets || []

    const now = Date.now()
    const [x, y] = source.reduce<[number[], number[]]>(
      (acc, cur) => {
        if (cur?.date * 1000 >= now - chartPeriods[period]) {
          acc[0].push(cur.date)

          const usdValue = cur.usdValue
          acc[1].push(usdValue)
        }
        return acc
      },
      [[], []],
    )

    return [x.reverse(), y.reverse()]
  }, [buckets, period])

  const onMouseOver = useCallback(
    ({ name, value }: { name: number; value: number }) => {
      const valNode = document.querySelector<HTMLElement>(
        '.usdValueHoveredValue',
      )
      const dateNode = document.querySelector<HTMLElement>(
        '.usdValueHoveredDate',
      )
      if (valNode) valNode.textContent = `${value.toFixed(2)}`
      if (dateNode)
        dateNode.textContent = format(new Date(name * 1000), 'dd MMM yyyy')
    },
    [],
  )

  const formatLabel = (date: Date, period: AssetsChartPeriod): string => {
    switch (period) {
      case AssetsChartPeriod.OneDay:
        return format(date, 'h a')
      case AssetsChartPeriod.SevenDay:
        return format(date, 'eee')
      case AssetsChartPeriod.ThirtyDay:
        return format(date, 'MMM dd')
      case AssetsChartPeriod.All:
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
            <span class="text-sm font-medium text-gray-900 dark:text-slate-50">$${value}</span>
            <span class="text-xs font-medium text-gray-500 dark:text-slate-400">${
              date instanceof Date && !Number.isNaN(date?.getTime())
                ? format(
                    date,
                    `dd MMM yyyy${chartPeriods[period] < chartPeriods[AssetsChartPeriod.OneDay] ? ' p' : ''}`,
                  )
                : ''
            }</span>
          </div>`
        },
        borderWidth: 0,
      },
      grid: {
        top: isSmallScreen ? 10 : 30,
        left: isSmallScreen ? 65 : 90,
        right: 6,
        bottom: isSmallScreen ? 50 : 70,
      },
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
            period === AssetsChartPeriod.OneDay
              ? isSmallScreen
                ? 3
                : 6
              : period === AssetsChartPeriod.SevenDay
                ? 7
                : period === AssetsChartPeriod.ThirtyDay
                  ? isSmallScreen
                    ? 1
                    : 4
                  : period === AssetsChartPeriod.All
                    ? isSmallScreen
                      ? 3
                      : 6
                    : 5,
          axisLabel: {
            formatter: (value: number) => formatLabel(new Date(value), period),
            color: (tailwind.theme?.colors?.slate as Record<string, string>)[
              '450'
            ],
            fontWeight: 600,
            fontSize: isSmallScreen ? 12 : 14,
            margin: isSmallScreen ? 20 : 40,
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
          show: true,
          min: Math.min(...yData) - 1,
          max: Math.max(...yData) + 1,
          interval: (Math.max(...yData) - Math.min(...yData)) / 4,
          axisLabel: {
            formatter: (value: number) => `${formatUSD(value)}`,
            color: (tailwind.theme?.colors?.slate as Record<string, string>)[
              '450'
            ],
            fontWeight: 600,
            fontSize: isSmallScreen ? 12 : 14,
            margin: isSmallScreen ? 20 : 40,
          },
          splitLine: {
            show: false,
          },
          axisLine: { show: false },
          axisTick: { show: false },
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
    [xData, yData, onMouseOver, period, isDark, isSmallScreen],
  )

  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader className="!px-0 !p-4 md:!py-6">
        <div className="flex flex-col gap-4 justify-between px-6 pb-4 md:pb-6 md:gap-0 md:items-center md:flex-row">
          <AssetsFilter
            setSelectedToken={setSelectedToken}
            selectedToken={selectedToken}
          />
          {selectedToken && <ActionButtons token={selectedToken} />}
        </div>
        <div className="h-[1px] bg-accent w-full !mt-0" />
        <CardTitle className="!text-primary px-6 pt-4 md:pt-6">
          <div className="flex flex-col-reverse gap-1 justify-between items-start md:items-center md:flex-row md:gap-0">
            <div className="flex flex-col gap-1 pt-6 w-full md:pt-0">
              <span className="text-2xl !font-medium">$52,526.96</span>

              <span className="!font-medium text-green-500">
                +5.6% ($2,785.43)
              </span>
            </div>
            <div className="flex flex-col-reverse gap-2 items-start md:items-center md:flex-row">
              <div className="flex gap-2">
                <ChartPeriodButton
                  active={period === AssetsChartPeriod.OneDay}
                  onClick={() => setPeriod(AssetsChartPeriod.OneDay)}
                >
                  1d
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === AssetsChartPeriod.SevenDay}
                  onClick={() => setPeriod(AssetsChartPeriod.SevenDay)}
                >
                  7d
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === AssetsChartPeriod.ThirtyDay}
                  onClick={() => setPeriod(AssetsChartPeriod.ThirtyDay)}
                >
                  30d
                </ChartPeriodButton>

                <ChartPeriodButton
                  active={period === AssetsChartPeriod.All}
                  onClick={() => setPeriod(AssetsChartPeriod.All)}
                >
                  All
                </ChartPeriodButton>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!pb-2">
        {isLoading ? (
          <SkeletonBox
            className={classNames(
              'w-full h-[230px] !mb-4 dark:via-slate-800 dark:to-slate-900',
            )}
          />
        ) : isError ? (
          <div className="h-[134px] !mb-4 w-full" />
        ) : (
          <ReactEchartsCore
            echarts={echarts}
            option={option}
            style={{ height: 246 }}
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
  className?: string
}

const ChartPeriodButton: FC<ChartPeriodButtonProps> = ({
  active,
  onClick,
  children,
  className,
}) => {
  return (
    <Button
      size="sm"
      variant={active ? 'tertiary' : 'ghost'}
      onClick={onClick}
      className={classNames(
        '!h-8 !min-h-[32px] w-[46px]',
        !active && '!font-normal !text-primary',
        className,
      )}
    >
      {children}
    </Button>
  )
}
