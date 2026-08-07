import type { LaunchpadCandle } from '@sushiswap/graph-client/data-api'
import { describe, expect, it } from 'vitest'
import { buildLaunchpadEmbedSparkline } from './launchpad-embed-sparkline'

function candle(
  timestamp: number,
  close: number,
  open = close,
): LaunchpadCandle {
  return {
    timestamp,
    open,
    high: Math.max(open, close),
    low: Math.min(open, close),
    close,
    volumeUsd: 1_000,
    tradeCount: 5,
  }
}

describe('buildLaunchpadEmbedSparkline', () => {
  it('returns null without enough history', () => {
    expect(buildLaunchpadEmbedSparkline(null)).toBeNull()
    expect(buildLaunchpadEmbedSparkline([])).toBeNull()
    expect(buildLaunchpadEmbedSparkline([candle(1, 1)])).toBeNull()
  })

  it('spans the full viewbox and maps the low and high to the line band', () => {
    const sparkline = buildLaunchpadEmbedSparkline([
      candle(1, 1),
      candle(2, 3),
      candle(3, 2),
    ])

    expect(sparkline?.linePath).toBe('M0,252 L600,14 L1200,133')
    expect(sparkline?.areaPath).toBe(
      'M0,252 L600,14 L1200,133 L1200,300 L0,300 Z',
    )
  })

  it('centers a flat series', () => {
    const sparkline = buildLaunchpadEmbedSparkline([
      candle(1, 5),
      candle(2, 5),
      candle(3, 5),
    ])

    expect(sparkline?.linePath).toBe('M0,133 L600,133 L1200,133')
    expect(sparkline?.changePercent).toBe(0)
    expect(sparkline?.isUp).toBe(true)
  })

  it('measures the change from the first open to the last close', () => {
    const sparkline = buildLaunchpadEmbedSparkline([
      candle(1, 1.2, 1),
      candle(2, 1.5),
    ])

    expect(sparkline?.changePercent).toBeCloseTo(50)
    expect(sparkline?.isUp).toBe(true)
  })

  it('flags a downtrend', () => {
    const sparkline = buildLaunchpadEmbedSparkline([
      candle(1, 4, 4),
      candle(2, 3),
    ])

    expect(sparkline?.changePercent).toBeCloseTo(-25)
    expect(sparkline?.isUp).toBe(false)
  })

  it('sorts and drops unusable candles', () => {
    const sparkline = buildLaunchpadEmbedSparkline([
      candle(3, 2),
      candle(1, 1),
      candle(2, 0),
      candle(4, Number.NaN),
    ])

    expect(sparkline?.linePath).toBe('M0,252 L1200,14')
  })

  it('downsamples long series to keep the path small', () => {
    const candles = Array.from({ length: 500 }, (_, index) =>
      candle(index + 1, 1 + index / 100),
    )

    const sparkline = buildLaunchpadEmbedSparkline(candles)

    expect(sparkline?.linePath.split(' ').length).toBe(64)
    expect(sparkline?.linePath.startsWith('M0,252')).toBe(true)
    expect(sparkline?.linePath.endsWith('L1200,14')).toBe(true)
  })
})
