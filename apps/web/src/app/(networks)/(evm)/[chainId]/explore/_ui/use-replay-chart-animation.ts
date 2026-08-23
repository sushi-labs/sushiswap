import type { EChartOption } from 'echarts'
import type ReactEchartsCore from 'echarts-for-react/lib/core'
import { type RefObject, useEffect, useRef } from 'react'

function useReplayChartAnimation(
  chartRef: RefObject<ReactEchartsCore | null>,
  option: EChartOption,
): void {
  const hasConnected = useRef(false)

  useEffect(() => {
    if (!hasConnected.current) {
      hasConnected.current = true
      return
    }

    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) return

    // Cache Components preserve inactive routes. Effects reconnect when the
    // route becomes visible again, so reset the chart to replay its animation.
    chart.clear()
    chart.setOption(option)
  }, [chartRef, option])
}

export { useReplayChartAnimation }
