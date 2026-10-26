import { describe, expect, it } from 'vitest'
import {
  buildPoolDepthData,
  getInitialVisibleSteps,
  getNextVisibleSteps,
} from './depth-chart'

describe('buildPoolDepthData', () => {
  it('builds cumulative sell and buy depth around the current price', () => {
    const result = buildPoolDepthData({
      series: [
        { activeLiquidity: 100, price0: 1 },
        { activeLiquidity: 200, price0: 2 },
        { activeLiquidity: 0, price0: 4 },
      ],
      currentPrice: 2.5,
      token0Decimals: 18,
      token1Decimals: 18,
    })

    expect(
      result.sell.map(({ logicalIndex, price }) => ({ logicalIndex, price })),
    ).toEqual([
      { logicalIndex: -2, price: 1 },
      { logicalIndex: -1, price: 2 },
      { logicalIndex: 0, price: 2.5 },
    ])
    expect(
      result.buy.map(({ logicalIndex, price }) => ({ logicalIndex, price })),
    ).toEqual([
      { logicalIndex: 0, price: 2.5 },
      { logicalIndex: 1, price: 4 },
    ])
    expect(result.sell[0].depth).toBeGreaterThan(result.sell[1].depth)
    expect(result.buy[1].depth).toBeGreaterThan(0)
  })

  it('keeps the two sides evenly spaced regardless of price magnitude', () => {
    const result = buildPoolDepthData({
      series: [
        { activeLiquidity: 100, price0: 41_000_000 },
        { activeLiquidity: 100, price0: 43_000_000 },
        { activeLiquidity: 0, price0: 389_000_000 },
      ],
      currentPrice: 44_000_000,
      token0Decimals: 18,
      token1Decimals: 18,
    })

    expect(result.sell.map(({ logicalIndex }) => logicalIndex)).toEqual([
      -2, -1, 0,
    ])
    expect(result.buy.map(({ logicalIndex }) => logicalIndex)).toEqual([0, 1])
  })

  it('returns empty sides when the current range cannot be identified', () => {
    expect(
      buildPoolDepthData({
        series: [{ activeLiquidity: 100, price0: 2 }],
        currentPrice: 1,
        token0Decimals: 18,
        token1Decimals: 18,
      }),
    ).toEqual({ sell: [], buy: [] })
  })
})

describe('depth chart zoom', () => {
  it('shows every point by default for sparse pools', () => {
    expect(getInitialVisibleSteps(3)).toBe(3)
    expect(getInitialVisibleSteps(8)).toBe(8)
    expect(getInitialVisibleSteps(10)).toBe(4)
  })

  it('always changes the visible range when zooming is available', () => {
    expect(
      getNextVisibleSteps({
        visibleSteps: 2,
        maxSteps: 10,
        direction: 'in',
      }),
    ).toBe(1)
    expect(
      getNextVisibleSteps({
        visibleSteps: 2,
        maxSteps: 10,
        direction: 'out',
      }),
    ).toBe(3)
    expect(
      getNextVisibleSteps({
        visibleSteps: 9,
        maxSteps: 10,
        direction: 'out',
      }),
    ).toBe(10)
  })
})
