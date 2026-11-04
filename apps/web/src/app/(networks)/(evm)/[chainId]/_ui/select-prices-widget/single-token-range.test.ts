import { Bound } from 'src/lib/constants'
import { tryParseTick } from 'src/lib/functions'
import {
  EvmChainId,
  EvmNative,
  EvmToken,
  SushiSwapV3Pool,
  TICK_SPACINGS,
  TickMath,
  USDC,
  WETH9,
  nearestUsableTick,
} from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getSingleTokenRange } from './single-token-range'

const token0 = USDC[EvmChainId.ETHEREUM]
const token1 = WETH9[EvmChainId.ETHEREUM]

describe('single-token range ticks', () => {
  for (const fee of [100, 500, 3000, 10000] as const) {
    const spacing = TICK_SPACINGS[fee]
    for (const tickCurrent of [
      -85176,
      0,
      TickMath.MIN_TICK,
      TickMath.MAX_TICK - 1,
    ]) {
      it.each([false, true])(
        `selects only the requested token at fee ${fee}, tick ${tickCurrent}, inverted=%s`,
        (inverted) => {
          const pool = new SushiSwapV3Pool(
            token0,
            token1,
            fee,
            TickMath.getSqrtRatioAtTick(tickCurrent),
            1000000n,
            tickCurrent,
          )
          const base = inverted ? token1 : token0
          const quote = inverted ? token0 : token1
          for (const depositToken of [token0, token1]) {
            const range = getSingleTokenRange({
              pool,
              token0: base,
              token1: quote,
              depositToken,
            })
            const isToken0 = depositToken.isSame(pool.token0)
            const min = nearestUsableTick(TickMath.MIN_TICK, spacing)
            const max = nearestUsableTick(TickMath.MAX_TICK, spacing)
            if (
              (isToken0 && tickCurrent >= max) ||
              (!isToken0 && tickCurrent <= min)
            ) {
              expect(range).toBeUndefined()
              continue
            }
            expect(range).toBeDefined()
            expect(range!.bound).toBe(
              depositToken.isSame(base) ? Bound.LOWER : Bound.UPPER,
            )
            const tick = tryParseTick(base, quote, fee, range!.value)!
            expect(Number.isInteger(tick)).toBe(true)
            expect(Math.abs(tick % spacing)).toBe(0)
            const sqrt = TickMath.getSqrtRatioAtTick(tick)
            if (isToken0) {
              expect(sqrt).toBeGreaterThanOrEqual(pool.sqrtRatioX96)
              expect(tick).toBeLessThan(max)
            } else {
              expect(sqrt).toBeLessThanOrEqual(pool.sqrtRatioX96)
              expect(tick).toBeGreaterThan(min)
            }
          }
        },
      )
    }
  }

  it('treats native currency and its wrapped token as the same deposit asset', () => {
    const pool = new SushiSwapV3Pool(
      token0,
      token1,
      3000,
      TickMath.getSqrtRatioAtTick(0),
      1000000n,
      0,
    )
    expect(
      getSingleTokenRange({
        pool,
        token0,
        token1,
        depositToken: EvmNative.fromChainId(EvmChainId.ETHEREUM),
      }),
    ).toEqual(
      getSingleTokenRange({ pool, token0, token1, depositToken: token1 }),
    )
  })

  it('does not produce a range without a pool price or for an unrelated deposit token', () => {
    expect(
      getSingleTokenRange({
        pool: undefined,
        token0,
        token1,
        depositToken: token0,
      }),
    ).toBeUndefined()
    const pool = new SushiSwapV3Pool(
      token0,
      token1,
      3000,
      TickMath.getSqrtRatioAtTick(0),
      1000000n,
      0,
    )
    const unrelated = new EvmToken({
      chainId: EvmChainId.ETHEREUM,
      address: '0x0000000000000000000000000000000000000001',
      symbol: 'NEW',
      name: 'New token',
      decimals: 18,
    })
    expect(
      getSingleTokenRange({ pool, token0, token1, depositToken: unrelated }),
    ).toBeUndefined()
  })
})
