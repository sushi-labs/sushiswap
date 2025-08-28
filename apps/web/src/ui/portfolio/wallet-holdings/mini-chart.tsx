import ReactEchartsCore from 'echarts-for-react/lib/core'
import { LineChart, type LineSeriesOption } from 'echarts/charts'
import { GridComponent, type GridComponentOption } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useMemo } from 'react'

echarts.use([LineChart, GridComponent, CanvasRenderer])

type MiniChartProps = {
  xData: number[] // UNIX timestamps in seconds
  yData: number[]
  color?: string // Optional custom color
}

type EChartOption = echarts.ComposeOption<
  LineSeriesOption | GridComponentOption
>

export function MiniChart({ xData, yData, color }: MiniChartProps) {
  const option = useMemo<EChartOption>(() => {
    return {
      grid: { top: 3, left: 0, right: 0, bottom: 0.5 },
      xAxis: {
        type: 'time',
        show: false,
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        min: Math.min(...yData),
        max: Math.max(...yData),
      },
      series: [
        {
          type: 'line',
          showSymbol: false,
          smooth: true,
          lineStyle: {
            width: 1.1,
            color: color,
          },
          data: xData.map((x, i) => [x * 1000, yData[i]]),
        },
      ],
    }
  }, [xData, yData, color])

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={option}
      style={{ width: 212, height: 40 }}
    />
  )
}
