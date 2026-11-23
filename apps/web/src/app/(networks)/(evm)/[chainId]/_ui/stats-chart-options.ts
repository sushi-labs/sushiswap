import format from 'date-fns/format'
import type {
  EChartsOption,
  LineSeriesOption,
  TooltipComponentFormatterCallbackParams,
  TooltipComponentOption,
} from 'echarts'
import { graphic } from 'echarts/core'

export const statsChartColors = {
  v2: '#A0A0A0',
  v3: '#FA52A0',
  blade: '#F23BF6',
} as const

const chartTextColor = '#A0A0A0'

export function getStatsChartTooltip(
  formatter: (params: TooltipComponentFormatterCallbackParams) => string,
): TooltipComponentOption {
  return {
    trigger: 'axis',
    padding: 0,
    borderWidth: 0,
    axisPointer: {
      lineStyle: { type: 'dashed', color: chartTextColor },
    },
    formatter,
  }
}

export function getStatsChartAxes({
  resolvedTheme,
  dateFormat = 'd MMM',
  min,
  max,
}: {
  resolvedTheme: string | undefined
  dateFormat?: string
  min?: number
  max?: number
}): Pick<EChartsOption, 'grid' | 'xAxis' | 'yAxis'> {
  return {
    grid: { top: 24, left: 0, right: 0, bottom: 0, containLabel: true },
    xAxis: [
      {
        type: 'time',
        min,
        max,
        splitNumber: 3,
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          hideOverlap: true,
          color: chartTextColor,
          margin: 16,
          formatter: (value: number) => format(new Date(value), dateFormat),
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        splitNumber: 3,
        axisLabel: { show: false },
        splitLine: {
          lineStyle: {
            color: resolvedTheme === 'light' ? '#e3e3e3' : '#3b3b3b',
          },
        },
      },
    ],
  }
}

export function getStatsLineStyle(
  color: string,
): Pick<LineSeriesOption, 'smooth' | 'showSymbol' | 'lineStyle' | 'areaStyle'> {
  return {
    smooth: true,
    showSymbol: false,
    lineStyle: { color, width: 2 },
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: `${color}40` },
        { offset: 1, color: `${color}00` },
      ]),
    },
  }
}
