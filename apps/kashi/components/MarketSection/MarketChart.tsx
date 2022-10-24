import { formatUSD } from '@sushiswap/format'
import { classNames, Typography } from '@sushiswap/ui'
import { format } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC, useCallback, useMemo, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig)

interface MarketChartProps {
  pair: KashiMediumRiskLendingPairV1
}

enum MarketChartType {
  Volume,
  TVL,
  Fees,
}

enum MarketChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

// TODO MAKE DYNAMIC
const FEE_BPS = 0.0005

const chartTimespans: Record<MarketChartPeriod, number> = {
  [MarketChartPeriod.Day]: 86400 * 1000,
  [MarketChartPeriod.Week]: 604800 * 1000,
  [MarketChartPeriod.Month]: 2629746 * 1000,
  [MarketChartPeriod.Year]: 31556952 * 1000,
  [MarketChartPeriod.All]: Infinity,
}

export const MarketChart: FC<MarketChartProps> = () => {
  const [chartType, setChartType] = useState<MarketChartType>(MarketChartType.Volume)
  const [chartPeriod, setChartPeriod] = useState<MarketChartPeriod>(MarketChartPeriod.All)

  const [xData, yData] = useMemo(() => {
    // const data = chartTimespans[chartPeriod] <= chartTimespans[MarketChartPeriod.Week] ? pair.hourData : pair.dayData
    // const currentDate = Math.round(Date.now())
    // const [x, y] = data.reduce<[number[], number[]]>(
    //   (acc, cur) => {
    //     if (cur.date * 1000 >= currentDate - chartTimespans[chartPeriod]) {
    //       acc[0].push(cur.date)
    //       acc[1].push(
    //         Number(
    //           chartType === MarketChartType.Fees
    //             ? cur.volumeUSD * FEE_BPS
    //             : chartType === MarketChartType.Volume
    //             ? cur.volumeUSD
    //             : cur.reserveUSD
    //         )
    //       )
    //     }
    //
    //     return acc
    //   },
    //   [[], []]
    // )
    //
    // return [x.reverse(), y.reverse()]
    return [[], []]
  }, [])

  const DEFAULT_OPTION: EChartsOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        extraCssText: 'z-index: 1000',
        responsive: true,
        backgroundColor: tailwind.theme.colors.slate['700'],
        textStyle: {
          color: tailwind.theme.colors.slate['50'],
          fontSize: 12,
          fontWeight: 600,
        },
        formatter: (params) => {
          const date = new Date(Number(params[0].name * 1000))
          return `<div class="flex flex-col gap-0.5">
            <span class="text-sm text-slate-50 font-bold">${formatUSD(params[0].value)}</span>
            <span class="text-xs text-slate-400 font-medium">${
              date instanceof Date && !isNaN(date?.getTime()) ? format(date, 'dd MMM yyyy HH:mm') : ''
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
        color: [tailwind.theme.colors.blue['500']],
      },
      xAxis: [
        {
          show: false,
          type: 'category',
          boundaryGap: true,
          data: xData,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          scale: true,
          name: 'Volume',
          max: 'dataMax',
          min: 'dataMin',
        },
      ],
      series: [
        {
          name: 'Volume',
          type: chartType === MarketChartType.TVL ? 'line' : 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            color: 'blue',
            normal: {
              barBorderRadius: 2,
            },
          },
          areaStyle: {
            color: tailwind.theme.colors.blue['500'],
          },
          animationEasing: 'elasticOut',
          animationDelayUpdate: function (idx) {
            return idx * 2
          },
          data: yData,
        },
      ],
    }),
    [chartType, xData, yData]
  )

  // Transient update for performance
  const onMouseOver = useCallback(
    ({ name, value }) => {
      const valueNodes = document.getElementsByClassName('hoveredItemValue')
      const nameNodes = document.getElementsByClassName('hoveredItemName')

      valueNodes[0].innerHTML = formatUSD(value)
      if (chartType === MarketChartType.Volume) {
        valueNodes[1].innerHTML = formatUSD(value * FEE_BPS)
      }
      nameNodes[0].innerHTML = format(new Date(name * 1000), 'dd MMM yyyy HH:mm')
    },
    [chartType]
  )

  const onEvents = useMemo(() => {
    return {
      mouseover: onMouseOver,
    }
  }, [onMouseOver])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="flex gap-6">
          <button
            onClick={() => setChartType(MarketChartType.Volume)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.Volume ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            Volume
          </button>
          <button
            onClick={() => setChartType(MarketChartType.TVL)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.TVL ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            TVL
          </button>
          <button
            onClick={() => setChartType(MarketChartType.Fees)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === MarketChartType.Fees ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            Fees
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setChartPeriod(MarketChartPeriod.Day)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Day ? 'text-blue' : 'text-slate-500'
            )}
          >
            1D
          </button>
          <button
            onClick={() => setChartPeriod(MarketChartPeriod.Week)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Week ? 'text-blue' : 'text-slate-500'
            )}
          >
            1W
          </button>
          <button
            onClick={() => setChartPeriod(MarketChartPeriod.Month)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Month ? 'text-blue' : 'text-slate-500'
            )}
          >
            1M
          </button>
          <button
            onClick={() => setChartPeriod(MarketChartPeriod.Year)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.Year ? 'text-blue' : 'text-slate-500'
            )}
          >
            1Y
          </button>
          <button
            onClick={() => setChartPeriod(MarketChartPeriod.All)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === MarketChartPeriod.All ? 'text-blue' : 'text-slate-500'
            )}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography variant="xl" weight={500} className="text-slate-50">
          <span className="hoveredItemValue">{formatUSD(yData[yData.length - 1])}</span>{' '}
          {chartType === MarketChartType.Volume && (
            <span className="text-sm font-medium text-slate-300">
              <span className="text-xs top-[-2px] relative">•</span>{' '}
              <span className="hoveredItemValue">{formatUSD(yData[yData.length - 1] * FEE_BPS)}</span> earned
            </span>
          )}
        </Typography>
        <Typography variant="sm" className="text-slate-500 hoveredItemName">
          {/*{format(new Date(xData[xData.length - 1] * 1000), 'dd MMM yyyy HH:mm')}*/}
        </Typography>
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 400 }} onEvents={onEvents} />
    </div>
  )
}
