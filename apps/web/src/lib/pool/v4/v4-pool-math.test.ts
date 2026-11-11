import { Percent } from 'sushi'
import {
  EvmChainId,
  EvmToken,
  SqrtPriceMath,
  SushiSwapV4Pool,
  SushiSwapV4Position,
  TickMath,
} from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  getV4MintMaxAmounts,
  getV4PoolReserves,
  getV4TickBitmapWords,
} from './v4-pool-math'

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

describe('getV4MintMaxAmounts', () => {
  const currency0 = new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address: '0x0000000000000000000000000000000000000001',
    decimals: 18,
    symbol: 'AAA',
    name: 'Token A',
  })
  const currency1 = new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address: '0x0000000000000000000000000000000000000002',
    decimals: 6,
    symbol: 'BBB',
    name: 'Token B',
  })
  const tickCurrent = -200000
  const pool = new SushiSwapV4Pool({
    currencyA: currency0,
    currencyB: currency1,
    fee: 500,
    tickSpacing: 10,
    poolManager: '0x0000000000000000000000000000000000000003',
    sqrtRatioX96: TickMath.getSqrtRatioAtTick(tickCurrent),
    liquidity: 0n,
    tickCurrent,
  })
  const slippage = new Percent({ numerator: 5, denominator: 1000 })

  it('gives no maximum to the currency a single-sided range takes none of', () => {
    // One spacing above the price, where the slippage-adjusted price is in range
    const position = SushiSwapV4Position.fromAmounts({
      pool,
      tickLower: tickCurrent + 10,
      tickUpper: tickCurrent + 1000,
      amount0: 10n ** 18n,
      amount1: 0n,
      useFullPrecision: true,
    })
    const [max0, max1] = getV4MintMaxAmounts(position, slippage)
    expect(max0.amount).toBeGreaterThan(0n)
    expect(max1.amount).toBe(0n)
  })
})
