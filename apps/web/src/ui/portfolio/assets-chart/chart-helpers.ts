import { format } from 'date-fns'
import ms from 'ms'
import { formatUSD } from 'sushi'

type TooltipParams = {
  chartRange: string
  onMouseOver: (data: { name: number; value: number }) => void
}

export const getTooltipFormatter = ({
  chartRange,
  onMouseOver,
}: TooltipParams) => {
  return (params: any) => {
    const [timestamp, value] = Array.isArray(params[0].value)
      ? params[0].value
      : [params[0].name, params[0].value]

    const numericValue = typeof value === 'number' ? value : Number(value) || 0

    const date = new Date(Number(timestamp) / 1000) // ✅ microseconds → ms
    const dateLabel = !Number.isNaN(date.getTime())
      ? format(date, chartRange === 'ONE_DAY' ? 'dd MMM yyyy p' : 'dd MMM yyyy')
      : ''

    onMouseOver({ name: Number(timestamp), value: numericValue })

    return `
      <div class="flex flex-col gap-0.5 bg-white/60 dark:bg-slate-800/60 px-3 py-2 rounded-xl shadow-md backdrop-blur-md">
        <span class="text-sm font-medium text-gray-900 dark:text-slate-50">${formatUSD(
          numericValue,
        )}</span>
        <span class="text-xs font-medium text-gray-500 dark:text-slate-400">${dateLabel}</span>
      </div>
    `
  }
}

export const getXAxisConfig = ({
  chartRange,
  isSmallScreen,
  formatLabel,
  tailwind,
}: any) => ({
  type: 'time' as const,
  show: true,
  boundaryGap: false,
  splitNumber:
    chartRange === 'ONE_DAY'
      ? isSmallScreen
        ? 3
        : 5
      : chartRange === 'SEVEN_DAYS'
        ? 7
        : chartRange === 'THIRTY_DAYS'
          ? isSmallScreen
            ? 5
            : 10
          : isSmallScreen
            ? 3
            : 5,
  axisLabel: {
    formatter: (value: number) =>
      formatLabel(new Date(normalizeTimestamp(value)), chartRange),
    color: (tailwind.theme?.colors?.slate as Record<string, string>)['450'],
    fontWeight: 600 as const,
    fontSize: isSmallScreen ? 12 : 14,
    margin: isSmallScreen ? 20 : 40,
  },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: { show: false },
})

export const getYAxisConfig = ({ yData, isSmallScreen, tailwind }: any) => {
  if (!yData?.length) return {}

  const minVal = Math.min(...yData)
  const maxVal = Math.max(...yData)

  const range = maxVal - minVal
  const step = range / 4

  const magnitude = 10 ** Math.floor(Math.log10(step))
  const niceStep = Math.ceil(step / magnitude) * magnitude

  const niceMin = Math.floor(minVal / niceStep) * niceStep
  const niceMax = Math.ceil(maxVal / niceStep) * niceStep

  return {
    type: 'value' as const,
    show: true,
    min: niceMin,
    max: niceMax,
    interval: niceStep,
    axisLabel: {
      formatter: (value: number) => formatUSD(value),
      color: (tailwind.theme?.colors?.slate as Record<string, string>)['450'],
      fontWeight: 'bold',
      fontSize: isSmallScreen ? 12 : 14,
      margin: isSmallScreen ? 20 : 40,
    },
    splitLine: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
  }
}

export const getSeries = (
  xData: number[],
  yData: number[],
  markerSeries: any[],
) => [
  {
    type: 'line',
    showSymbol: false,
    smooth: true,
    lineStyle: { width: 2 },
    data: xData.map((x, i) => [x * ms('1s'), yData[i]]),
  },
  {
    type: 'scatter',
    data: markerSeries,
    z: 10,
  },
]

function normalizeTimestamp(x: number): number {
  if (x < 1e12) return x * 1000 // seconds → ms
  if (x > 1e13) return x / 1000 // microseconds → ms
  return x // already ms
}
