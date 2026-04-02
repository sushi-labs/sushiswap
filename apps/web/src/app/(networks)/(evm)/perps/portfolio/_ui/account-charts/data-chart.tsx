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
        borderColor: '#629FFF50',

        backgroundColor: '#18223B',
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
            color: '#629FFF',
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
