import { Bound } from 'src/lib/constants'
import { Price } from 'sushi'
import {
  EvmNative,
  EvmToken,
  TickMath,
  priceToClosestTick,
  tickToPrice,
} from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { PRICE_RANGE_MULTIPLIERS } from './range-prices'
import {
  getMultiplierRangeTicks,
  getSingleSidedRangeTick,
  getTickLimits,
  getTickToPrice,
  parsePriceTick,
  resolveRangeTick,
  stepRangeTick,
} from './ticks'

const ETH = EvmNative.fromChainId(1)
const WETH = ETH.wrap()
const USDC = new EvmToken({
  chainId: 1,
  address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
})

describe('CL ticks', () => {
  it('snaps tick limits to the tick spacing', () => {
    expect(getTickLimits(60)).toEqual({
      [Bound.LOWER]: -887220,
      [Bound.UPPER]: 887220,
    })
    expect(getTickLimits(undefined)[Bound.LOWER]).toBeUndefined()
  })

  it('parses prices of a native currency0 in either orientation', () => {
    // ETH is currency0 although WETH sorts after USDC
    const tick = parsePriceTick(ETH, USDC, '3000')!
    expect(
      Number(getTickToPrice(ETH, USDC, tick)!.toSignificant(4)),
    ).toBeCloseTo(3000, -1)
    // The same price, of USDC, lands within a tick of it
    const inverted = parsePriceTick(USDC, ETH, (1 / 3000).toFixed(18))!
    expect(Math.abs(inverted - tick)).toBeLessThanOrEqual(1)
  })

  it('clamps out of bounds prices to the tick limits', () => {
    const huge = `1${'0'.repeat(60)}`
    expect(parsePriceTick(ETH, USDC, huge)).toBe(TickMath.MAX_TICK)
    // Inverted, a huge price of currency1 is a tiny one of currency0
    expect(parsePriceTick(USDC, ETH, huge)).toBe(TickMath.MIN_TICK)
    expect(parsePriceTick(USDC, ETH, `0.${'0'.repeat(60)}1`)).toBe(
      TickMath.MAX_TICK,
    )
    // A price of 0 is the min price in either orientation
    expect(parsePriceTick(ETH, USDC, '0')).toBe(TickMath.MIN_TICK)
    expect(parsePriceTick(USDC, ETH, '0')).toBe(TickMath.MAX_TICK)
    expect(parsePriceTick(ETH, USDC, 'abc')).toBeUndefined()
    expect(parsePriceTick(undefined, USDC, '3000')).toBeUndefined()
  })

  it('matches V3 tick math for tokens', () => {
    for (const [base, quote] of [
      [WETH, USDC],
      [USDC, WETH],
    ] as const) {
      const price = Price.tryFromHuman(base, quote, '3000')!
      expect(parsePriceTick(base, quote, '3000')).toBe(
        priceToClosestTick(price),
      )
      expect(getTickToPrice(base, quote, 1234)!.toString({ fixed: 18 })).toBe(
        tickToPrice(base, quote, 1234).toString({ fixed: 18 }),
      )
    }
  })
})

describe('resolveRangeTick', () => {
  it('takes the limit on its side for `true`', () => {
    expect(resolveRangeTick(true, Bound.LOWER, 60)).toBe(-887220)
    expect(resolveRangeTick(true, Bound.UPPER, 60)).toBe(887220)
    expect(resolveRangeTick(true, Bound.LOWER, undefined)).toBeUndefined()
    expect(resolveRangeTick(undefined, Bound.LOWER, 60)).toBeUndefined()
  })

  it('snaps a tick outward to the spacing, within the limits', () => {
    expect(resolveRangeTick(1, Bound.LOWER, 1)).toBe(1)
    expect(resolveRangeTick(-131, Bound.UPPER, 60)).toBe(-120)
    expect(resolveRangeTick(-131, Bound.LOWER, 60)).toBe(-180)
    expect(resolveRangeTick(TickMath.MAX_TICK, Bound.UPPER, 60)).toBe(887220)
  })

  it('keeps a range narrower than a new spacing from collapsing', () => {
    // ×÷1.01 at spacing 1, then spacing 200
    expect(resolveRangeTick(-100, Bound.LOWER, 200)).toBe(-200)
    expect(resolveRangeTick(100, Bound.UPPER, 200)).toBe(200)
  })
})

describe('stepRangeTick', () => {
  it('steps by one spacing, reversed for prices of currency1', () => {
    expect(stepRangeTick(120, 0, 60, 1, false)).toBe(180)
    expect(stepRangeTick(120, 0, 60, 1, true)).toBe(60)
    expect(stepRangeTick(120, 0, 60, -1, true)).toBe(180)
  })

  it('steps from the fallback tick for an unset bound', () => {
    expect(stepRangeTick(undefined, 600, 60, -1, false)).toBe(540)
    expect(stepRangeTick(undefined, undefined, 60, 1, false)).toBeUndefined()
    expect(stepRangeTick(0, 0, undefined, 1, false)).toBeUndefined()
  })
})

describe('getMultiplierRangeTicks', () => {
  const [double, , onePercent] = PRICE_RANGE_MULTIPLIERS.map(
    ({ multiplier }) => multiplier,
  )

  it('spans the multiplier either side of the current tick', () => {
    // ×÷2 is about 6931.6 ticks either way
    expect(getMultiplierRangeTicks(0, double!, 1)).toEqual([-6932, 6932])
    expect(getMultiplierRangeTicks(1000, double!, 60)).toEqual([-5940, 7920])
  })

  it('keeps a range narrower than the tick spacing one spacing wide', () => {
    // ×÷1.01 is about ±99.5 ticks, within one spacing of 200
    expect(getMultiplierRangeTicks(0, onePercent!, 200)).toEqual([0, 200])
    expect(getMultiplierRangeTicks(-50, onePercent!, 200)).toEqual([-200, 0])
  })
})

describe('stepRangeTick limits', () => {
  it('stays within the usable ticks', () => {
    expect(stepRangeTick(887220, 0, 60, 1, false)).toBe(887220)
    expect(stepRangeTick(-887220, 0, 60, 1, true)).toBe(-887220)
  })
})

describe('getSingleSidedRangeTick', () => {
  it('borders the price, excluding the current tick from the range above', () => {
    expect(getSingleSidedRangeTick(1234, 1, 'below')).toBe(1234)
    expect(getSingleSidedRangeTick(1234, 1, 'above')).toBe(1235)
    expect(getSingleSidedRangeTick(-130, 60, 'below')).toBe(-180)
    expect(getSingleSidedRangeTick(-130, 60, 'above')).toBe(-120)
  })
})

describe('getMultiplierRangeTicks limits', () => {
  it('stays within the usable ticks', () => {
    const [lower, upper] = getMultiplierRangeTicks(
      887000,
      PRICE_RANGE_MULTIPLIERS[0].multiplier,
      60,
    )
    expect(lower).toBe(880080)
    expect(upper).toBe(887220)
  })
})
