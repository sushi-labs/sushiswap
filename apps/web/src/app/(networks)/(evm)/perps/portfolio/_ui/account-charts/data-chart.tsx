import type { EChartOption } from 'echarts'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useMemo } from 'react'
import { formatUSD } from 'sushi'

echarts.use([CanvasRenderer, LineChart, TooltipComponent, GridComponent])

export const DataChart = ({
  data,
}: { data: [timestamp: number, value: string][] | undefined }) => {
  const DEFAULT_OPTION = useMemo<EChartOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        padding: 8,
        borderWidth: 1,
        borderColor: '#49A1DB',
        backgroundColor: '#49A1DB65',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          lineStyle: {
            type: 'solid',
          },
        },
        formatter: (params: any) => {
          const point = Array.isArray(params) ? params[0] : params
          const value = point.value as [number, string]
          const timestamp = value[0]
          const usdAmount = value[1]
          return `${new Date(
            timestamp,
          ).toLocaleString()}: ${formatUSD(usdAmount)}`
        },
      },

      grid: {
        top: 10,
        left: 65,
        right: 0,
        bottom: 10,
      },

      xAxis: [
        {
          type: 'category',
          show: false,
        },
      ],

      yAxis: [
        {
          type: 'value',
          show: true,
          min: (value: { min: number }) => value.min,
          max: (value: { max: number }) => value.max,

          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            formatter: (value: number) => value.toFixed(2), // adjust as needed
          },
        },
      ],

      series: [
        {
          type: 'line',
          smooth: false,
          showSymbol: false,
          step: 'end',
          lineStyle: {
            width: 2,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#27B0E6' },
                { offset: 0.034, color: '#49A1DB' },
                { offset: 0.092, color: '#7D8ACA' },
                { offset: 0.168, color: '#A279BD' },
                { offset: 0.231, color: '#BA6FB6' },
                { offset: 0.293, color: '#C26BB3' },
                { offset: 0.365, color: '#D563AD' },
                { offset: 0.453, color: '#E65BA7' },
                { offset: 0.531, color: '#F156A3' },
                { offset: 0.642, color: '#F853A1' },
                { offset: 0.781, color: '#FA52A0' },
                { offset: 1, color: '#FA52A0' },
              ],
              global: false,
            },
          },
          data: data ?? [],
        },
      ],
    }),
    [data],
  )
  return (
    <ReactEchartsCore
      option={DEFAULT_OPTION}
      echarts={echarts}
      className="max-h-[192px] min-h-[192px] h-full"
    />
  )
}
