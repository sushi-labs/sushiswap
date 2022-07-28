import { formatUSD } from '@sushiswap/format'
import { classNames, Typography } from '@sushiswap/ui'
import ReactECharts from 'echarts-for-react'
import { EChartsOption } from 'echarts-for-react/lib/types'
import { FC, useCallback, useMemo, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '../../tailwind.config.js'

const tailwind = resolveConfig(tailwindConfig)

import { Pair } from '../../.graphclient'

interface PoolChartProps {
  pair: Pair
}

enum PoolChartType {
  Volume,
  TVL,
  Price,
}

enum PoolChartPeriod {
  Day,
  Week,
  Month,
  Year,
  All,
}

const DEFAULT_OPTION: EChartsOption = {
  tooltip: {
    trigger: 'axis',
    responsive: true,
    backgroundColor: tailwind.theme.colors.slate['700'],
    textStyle: {
      color: tailwind.theme.colors.slate['50'],
      fontSize: 12,
      fontWeight: 600,
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
      data: (function () {
        let now = new Date()
        const res = []
        let len = 50
        while (len--) {
          res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
          now = new Date(now - 2000)
        }
        return res
      })(),
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
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: 'blue',
        normal: {
          barBorderRadius: 2,
        },
      },
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return idx * 10
      },
      animationDelayUpdate: function (idx) {
        return idx * 10
      },
      data: (function () {
        const res = []
        let len = 50
        while (len--) {
          res.push(Math.round(Math.random() * 1000))
        }
        return res
      })(),
    },
  ],
}

export const PoolChart: FC<PoolChartProps> = ({ pair }) => {
  const [chartType, setChartType] = useState<PoolChartType>(PoolChartType.Volume)
  const [chartPeriod, setChartPeriod] = useState<PoolChartPeriod>(PoolChartPeriod.All)

  // Transient update for performance
  const onMouseOver = useCallback(({ name, value }) => {
    const valueNodes = document.getElementsByClassName('hoveredItemValue')
    const nameNodes = document.getElementsByClassName('hoveredItemName')

    valueNodes[0].innerHTML = formatUSD(value)
    valueNodes[1].innerHTML = formatUSD(value * 0.05)
    nameNodes[0].innerHTML = name
  }, [])

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
            onClick={() => setChartType(PoolChartType.Volume)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === PoolChartType.Volume ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            Volume
          </button>
          <button
            onClick={() => setChartType(PoolChartType.TVL)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === PoolChartType.TVL ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            TVL
          </button>
          <button
            onClick={() => setChartType(PoolChartType.Price)}
            className={classNames(
              'border-b-[3px] pb-2 font-semibold text-sm',
              chartType === PoolChartType.Price ? 'text-slate-50 border-blue' : 'text-slate-500 border-transparent'
            )}
          >
            Price
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Day)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Day ? 'text-blue' : 'text-slate-500'
            )}
          >
            1D
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Week)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Week ? 'text-blue' : 'text-slate-500'
            )}
          >
            1W
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Month)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Month ? 'text-blue' : 'text-slate-500'
            )}
          >
            1M
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.Year)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.Year ? 'text-blue' : 'text-slate-500'
            )}
          >
            1Y
          </button>
          <button
            onClick={() => setChartPeriod(PoolChartPeriod.All)}
            className={classNames(
              'font-semibold text-sm',
              chartPeriod === PoolChartPeriod.All ? 'text-blue' : 'text-slate-500'
            )}
          >
            ALL
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        <Typography variant="xl" weight={500} className="text-slate-50">
          <span className="hoveredItemValue">$0.00</span>{' '}
          <span className="font-medium text-sm text-slate-300">
            <span className="text-xs top-[-2px] relative">•</span> <span className="hoveredItemValue">$0.00</span>{' '}
            earned
          </span>
        </Typography>
        <Typography variant="sm" className="text-slate-500 hoveredItemName">
          00:00:00
        </Typography>
      </div>
      <ReactECharts option={DEFAULT_OPTION} style={{ height: 400 }} onEvents={onEvents} />
    </div>
  )
}
