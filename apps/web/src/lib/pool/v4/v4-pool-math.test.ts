import { SqrtPriceMath, TickMath } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  getV4PoolReserves,
  getV4TickBitmapWords,
  getV4TickSpacing,
} from './v4-pool-math'

describe('getV4TickSpacing', () => {
  it('reads the tick spacing from bits 16-39 of the pool parameters', () => {
    expect(
      getV4TickSpacing(
        '0x00000000000000000000000000000000000000000000000000000000000a08c1',
      ),
    ).toBe(10)
    expect(
      getV4TickSpacing(
        '0x0000000000000000000000000000000000000000000000000000000000003c00',
      ),
    ).toBe(0)
    expect(
      getV4TickSpacing(
        '0x00000000000000000000000000000000000000000000000000000000003c0000',
      ),
    ).toBe(60)
  })
})

describe('getV4TickBitmapWords', () => {
  it('covers every word between the min and max tick', () => {
    const words = getV4TickBitmapWords(10)

    expect(words).toHaveLength(694)
    expect(words[0]).toBe(-347)
    expect(words.at(-1)).toBe(346)
  })

  it('shrinks with wider tick spacing', () => {
    expect(getV4TickBitmapWords(60)).toHaveLength(116)
    expect(getV4TickBitmapWords(200)).toHaveLength(36)
  })
})

describe('getV4PoolReserves', () => {
  it('returns zero reserves without ticks', () => {
    expect(getV4PoolReserves({ sqrtPriceX96: 2n ** 96n, ticks: [] })).toEqual([
      0n,
      0n,
    ])
  })

  it('matches the API for a live Robinhood pool within rounding', () => {
    // WETH/USDG on Robinhood; the API reported 103330580627587 and 267661
    const [reserve0, reserve1] = getV4PoolReserves({
      sqrtPriceX96: 4033233787059150920572805n,
      ticks: [
        { tick: -211550, liquidityNet: 3947702858n },
        { tick: -201190, liquidityNet: 20640884414n },
        { tick: -192080, liquidityNet: -3947702858n },
        { tick: -193060, liquidityNet: -20640884414n },
      ],
    })

    expect(reserve0).toBe(103330580627584n)
    expect(reserve1).toBe(267659n)
  })

  it('holds only token0 above the current price and only token1 below it', () => {
    const liquidity = 10n ** 18n
    const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(0)

    const above = getV4PoolReserves({
      sqrtPriceX96,
      ticks: [
        { tick: 60, liquidityNet: liquidity },
        { tick: 120, liquidityNet: -liquidity },
      ],
    })
    expect(above).toEqual([
      SqrtPriceMath.getAmount0Delta(
        TickMath.getSqrtRatioAtTick(60),
        TickMath.getSqrtRatioAtTick(120),
        liquidity,
        false,
      ),
      0n,
    ])

    const below = getV4PoolReserves({
      sqrtPriceX96,
      ticks: [
        { tick: -120, liquidityNet: liquidity },
        { tick: -60, liquidityNet: -liquidity },
      ],
    })
    expect(below).toEqual([
      0n,
      SqrtPriceMath.getAmount1Delta(
        TickMath.getSqrtRatioAtTick(-120),
        TickMath.getSqrtRatioAtTick(-60),
        liquidity,
        false,
      ),
    ])
  })

  it('splits an in-range position at the current price', () => {
    const liquidity = 10n ** 18n
    const sqrtPriceX96 = TickMath.getSqrtRatioAtTick(0)
    const sqrtLower = TickMath.getSqrtRatioAtTick(-60)
    const sqrtUpper = TickMath.getSqrtRatioAtTick(60)

    expect(
      getV4PoolReserves({
        sqrtPriceX96,
        ticks: [
          { tick: 60, liquidityNet: -liquidity },
          { tick: -60, liquidityNet: liquidity },
        ],
      }),
    ).toEqual([
      SqrtPriceMath.getAmount0Delta(sqrtPriceX96, sqrtUpper, liquidity, false),
      SqrtPriceMath.getAmount1Delta(sqrtLower, sqrtPriceX96, liquidity, false),
    ])
  })
})
