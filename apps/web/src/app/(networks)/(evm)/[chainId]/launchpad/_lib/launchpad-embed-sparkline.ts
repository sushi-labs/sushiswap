import type { LaunchpadCandle } from '@sushiswap/graph-client/data-api'

const VIEWBOX_WIDTH = 1200
const VIEWBOX_HEIGHT = 300
/** Vertical band the line is drawn in, matching the embed design. */
const LINE_TOP = 14
const LINE_BOTTOM = 252
const MAX_POINTS = 64

export interface LaunchpadEmbedSparklineResult {
  areaPath: string
  changePercent: number | null
  isUp: boolean
  linePath: string
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function downsample<T>(values: T[], max: number): T[] {
  if (values.length <= max) return values

  const step = (values.length - 1) / (max - 1)
  return Array.from(
    { length: max },
    (_, index) => values[Math.round(index * step)],
  )
}

/**
 * Turns launch pool candles into the embed's price line. Returns `null` when
 * there is not enough history to draw one.
 */
export function buildLaunchpadEmbedSparkline(
  candles: readonly LaunchpadCandle[] | null | undefined,
): LaunchpadEmbedSparklineResult | null {
  if (!candles?.length) return null

  const usable = candles
    .filter(
      (candle) =>
        Number.isFinite(candle.close) &&
        Number.isFinite(candle.timestamp) &&
        candle.close > 0,
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  if (usable.length < 2) return null

  const first = usable[0]
  const last = usable[usable.length - 1]
  const open =
    Number.isFinite(first.open) && first.open > 0 ? first.open : first.close
  const changePercent = ((last.close - open) / open) * 100

  const points = downsample(usable, MAX_POINTS).map((candle) => candle.close)
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min

  const coordinates = points.map((value, index) => {
    const x = round((index / (points.length - 1)) * VIEWBOX_WIDTH)
    const y = round(
      span === 0
        ? (LINE_TOP + LINE_BOTTOM) / 2
        : LINE_BOTTOM - ((value - min) / span) * (LINE_BOTTOM - LINE_TOP),
    )
    return `${x},${y}`
  })

  const linePath = `M${coordinates.join(' L')}`

  return {
    areaPath: `${linePath} L${VIEWBOX_WIDTH},${VIEWBOX_HEIGHT} L0,${VIEWBOX_HEIGHT} Z`,
    changePercent,
    isUp: changePercent >= 0,
    linePath,
  }
}
