import { SqrtPriceMath, TickMath, encodeSqrtRatioX96 } from 'sushi/evm'
import {
  STELLAR_USDC,
  STELLAR_XLM,
  StellarChainId,
  StellarToken,
} from 'sushi/stellar'
import { describe, expect, it } from 'vitest'
import {
  calculateDependentAmount,
  getLiquidityAmounts,
  parseLiquidityAmount,
  parseStartingPrice,
  poolPrice,
} from './liquidity-amounts'
import { getSqrtRatioAtTick, getTickAtSqrtRatio } from './ticks'

const token0 = STELLAR_XLM[StellarChainId.STELLAR]
const token1 = new StellarToken({
  ...STELLAR_USDC[StellarChainId.STELLAR].toJSON(),
  decimals: 6,
})
const Q96 = 1n << 96n

describe('Stellar liquidity amounts', () => {
  it('parses amounts exactly above the safe integer limit', () => {
    expect(parseLiquidityAmount('900719925.4740993', 7)).toBe(9007199254740993n)
    expect(parseLiquidityAmount('.0000001', 7)).toBe(1n)
    expect(parseLiquidityAmount('1.', 7)).toBe(10000000n)
  })
  it.each([
    '',
    '.',
    '-1',
    'NaN',
    'Infinity',
    '1e7',
    '1x',
    '0.00000001',
    '999999999999999999999999999999999999999999999',
  ])('rejects unsafe amount %s', (value) => {
    expect(() => parseLiquidityAmount(value, 7)).toThrow()
  })
  it('converts decimal-adjusted prices and their inverses to the same canonical price', () => {
    const sqrt = parseStartingPrice(token0, token1, '2')
    expect(sqrt).toBe(encodeSqrtRatioX96(2000000n, 10000000n))
    expect(parseStartingPrice(token0, token1, '.5', true)).toBe(sqrt)
    expect(poolPrice(token0, token1, sqrt!).toNumber()).toBeCloseTo(2, 12)
    expect(poolPrice(token0, token1, sqrt!, true).toNumber()).toBeCloseTo(
      0.5,
      12,
    )
  })
  it.each([
    '',
    '0',
    '-1',
    '1e100',
    'Infinity',
    '0.0000000000000000000000000000000000000000000000001',
    '99999999999999999999999999999999999999999999999999999',
  ])('rejects invalid or unencodable starting price %s', (value) => {
    expect(parseStartingPrice(token0, token1, value)).toBeUndefined()
    expect(parseStartingPrice(token0, token1, value, true)).toBeUndefined()
  })
  it('quotes both independent fields using their own decimals', () => {
    const from0 = calculateDependentAmount(
      '1000',
      'token0',
      7,
      6,
      Q96,
      -600,
      600,
    )
    expect(from0.status).toBe('within-range')
    const from1 = calculateDependentAmount(
      from0.amount,
      'token1',
      6,
      7,
      Q96,
      -600,
      600,
    )
    expect(from1.status).toBe('within-range')
    expect(Number(from1.amount)).toBeCloseTo(1000, 5)
    expect(Number(from0.amount)).toBeCloseTo(10000, 4)
  })
  it('supports single-sided deposits at the exact range boundaries', () => {
    const lower = getSqrtRatioAtTick(-600)
    const upper = getSqrtRatioAtTick(600)
    expect(
      calculateDependentAmount('10', 'token0', 7, 6, lower, -600, 600),
    ).toEqual({ amount: '0', status: 'below-range' })
    expect(
      calculateDependentAmount('10', 'token1', 6, 7, upper, -600, 600),
    ).toEqual({ amount: '0', status: 'above-range' })
    expect(
      calculateDependentAmount('10', 'token1', 6, 7, lower, -600, 600).error,
    ).toBeDefined()
    expect(
      calculateDependentAmount('10', 'token0', 7, 6, upper, -600, 600).error,
    ).toBeDefined()
  })
  it('rejects empty, malformed, dust, and reversed-range deposits', () => {
    expect(
      calculateDependentAmount('', 'token0', 7, 6, Q96, -600, 600).status,
    ).toBe('idle')
    for (const value of ['0', '-1', 'NaN', '0.00000001']) {
      expect(
        calculateDependentAmount(value, 'token0', 7, 6, Q96, -600, 600).status,
      ).toBe('error')
    }
    expect(
      calculateDependentAmount('1', 'token0', 7, 6, Q96, 600, -600).status,
    ).toBe('error')
    expect(
      calculateDependentAmount(
        '.0000001',
        'token0',
        7,
        6,
        TickMath.MIN_SQRT_RATIO,
        -887270,
        887270,
      ).status,
    ).toBe('error')
  })
  it('maximum deposits never exceed either balance, including zero balances and boundary prices', () => {
    for (const tick of [-700, -600, -1, 0, 1, 600, 700]) {
      for (const balance0 of [0n, 1n, 100000000n, 9007199254740993n]) {
        for (const balance1 of [0n, 1n, 30000000n, 9007199254740993n]) {
          const result = getLiquidityAmounts(
            getSqrtRatioAtTick(tick),
            -600,
            600,
            balance0,
            balance1,
          )
          expect(result.amount0).toBeLessThanOrEqual(balance0)
          expect(result.amount1).toBeLessThanOrEqual(balance1)
          expect(result.amount0).toBeGreaterThanOrEqual(0n)
          expect(result.amount1).toBeGreaterThanOrEqual(0n)
        }
      }
    }
  })
})

// Independent integer reference: Stellar periphery c5985292, liquidity_amounts.rs;
// locked core a606b31c, sqrt_price_math.rs. Do not use SDK liquidity/delta helpers here.
function referenceMint(
  p: bigint,
  a: bigint,
  b: bigint,
  amount0: bigint,
  amount1: bigint,
): { liquidity: bigint; amount0: bigint; amount1: bigint } {
  const price = p < a ? a : p > b ? b : p
  const liquidity0 =
    price < b ? (amount0 * ((price * b) / Q96)) / (b - price) : undefined
  const liquidity1 = price > a ? (amount1 * Q96) / (price - a) : undefined
  const liquidity =
    liquidity0 === undefined
      ? liquidity1!
      : liquidity1 === undefined
        ? liquidity0
        : liquidity0 < liquidity1
          ? liquidity0
          : liquidity1
  return {
    liquidity,
    amount0: (liquidity * Q96 * (b - price) + price * b - 1n) / (price * b),
    amount1: (liquidity * (price - a) + Q96 - 1n) / Q96,
  }
}

describe('independent contract math verification', () => {
  it('matches periphery rounding when token0 precision is lost before division', () => {
    const price = getSqrtRatioAtTick(-600000)
    const result = getLiquidityAmounts(
      price,
      -600060,
      -599940,
      10n ** 18n,
      10n ** 18n,
    )
    expect(result.liquidity).toBe(31245331n)
    expect(
      referenceMint(
        price,
        getSqrtRatioAtTick(-600060),
        getSqrtRatioAtTick(-599940),
        result.amount0,
        result.amount1,
      ).liquidity,
    ).toBe(result.liquidity)
  })
  it('rejects a deposit the periphery rounds to zero liquidity at very low prices', () => {
    expect(
      calculateDependentAmount(
        '100000000000',
        'token0',
        7,
        7,
        getSqrtRatioAtTick(-800000),
        -800060,
        -799940,
      ),
    ).toMatchObject({ status: 'error', error: 'Enter a larger amount' })
  })
  it('rejects liquidity outside the signed mint limit even when both token amounts fit', () => {
    const max = (1n << 127n) - 1n
    expect(
      calculateDependentAmount(max.toString(), 'token0', 0, 0, Q96, -10, 10),
    ).toMatchObject({
      status: 'error',
      error: 'Liquidity exceeds the Stellar mint limit',
    })
  })
  it('rejects intermediate u128 overflow even when the final liquidity fits', () => {
    expect(
      calculateDependentAmount(
        '1000000000000000000',
        'token1',
        0,
        0,
        getSqrtRatioAtTick(887270) - 1n,
        887260,
        887270,
      ),
    ).toMatchObject({
      status: 'error',
      error: 'Deposit exceeds the Stellar liquidity calculation limit',
    })
    // Check the entered amount, not just the smaller calculated deposit cap.
    expect(
      calculateDependentAmount(
        '100000000000000000000',
        'token1',
        0,
        0,
        getSqrtRatioAtTick(-600000) + 1n,
        -600000,
        -599940,
      ),
    ).toMatchObject({
      status: 'error',
      error: 'Deposit exceeds the Stellar liquidity calculation limit',
    })
  })
  it('matches independent floor/ceiling arithmetic across 5000 deterministic cases', () => {
    let seed = 2166
    function random(): number {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      return seed
    }
    for (let i = 0; i < 5000; i++) {
      const spacing = [10, 60, 200][i % 3]
      const min = Math.ceil(-887272 / spacing)
      const max = Math.floor(887272 / spacing)
      const lowerIndex = min + (random() % (max - min))
      const upperIndex = lowerIndex + 1 + (random() % (max - lowerIndex))
      const lowerTick = lowerIndex * spacing
      const upperTick = upperIndex * spacing
      const lower = getSqrtRatioAtTick(lowerTick)
      const upper = getSqrtRatioAtTick(upperTick)
      const price = [
        lower - 1n,
        lower,
        lower + 1n,
        (lower + upper) / 2n,
        upper - 1n,
        upper,
        upper + 1n,
      ][i % 7]
      const amount0 = BigInt(random()) * 10n ** BigInt(i % 20)
      const amount1 = BigInt(random()) * 10n ** BigInt((i + 7) % 20)
      const result = getLiquidityAmounts(
        price,
        lowerTick,
        upperTick,
        amount0,
        amount1,
      )
      const expected = referenceMint(price, lower, upper, amount0, amount1)
      expect(result.liquidity, `case ${i}: [${lowerTick}, ${upperTick}]`).toBe(
        expected.liquidity,
      )
      expect(result.amount0).toBeLessThanOrEqual(amount0)
      expect(result.amount1).toBeLessThanOrEqual(amount1)
      // Sending the calculated caps must mint all the intended liquidity.
      const reminted = referenceMint(
        price,
        lower,
        upper,
        result.amount0,
        result.amount1,
      )
      expect(reminted.liquidity, `round trip case ${i}`).toBe(result.liquidity)
      expect(reminted.amount0).toBeLessThanOrEqual(result.amount0)
      expect(reminted.amount1).toBeLessThanOrEqual(result.amount1)
    }
  })
  it('does not lose liquidity when deriving token0 from token1 at low prices', () => {
    const lower = getSqrtRatioAtTick(-600060)
    const price = getSqrtRatioAtTick(-600000)
    const upper = getSqrtRatioAtTick(-599940)
    const paired = calculateDependentAmount(
      '1',
      'token1',
      0,
      0,
      price,
      -600060,
      -599940,
    )
    expect(paired.status).toBe('within-range')
    expect(
      referenceMint(price, lower, upper, BigInt(paired.amount), 1n).liquidity,
    ).toBe(Q96 / (price - lower))
  })
  it('encodes the exact floor of the square root across decimal scales and quote directions', () => {
    const values = [
      '0.000000000001',
      '0.25',
      '1',
      '2.5',
      '9007199254740993.123456789',
    ]
    for (const decimals0 of [0, 6, 7, 18]) {
      for (const decimals1 of [0, 6, 7, 18]) {
        const base = new StellarToken({
          ...token0.toJSON(),
          decimals: decimals0,
        })
        const quote = new StellarToken({
          ...token1.toJSON(),
          decimals: decimals1,
        })
        for (const value of values) {
          for (const inverted of [false, true]) {
            const [whole, fraction = ''] = value.split('.')
            const valueUnits = BigInt(whole + fraction)
            const scale = 10n ** BigInt(fraction.length)
            const n = (inverted ? scale : valueUnits) * 10n ** BigInt(decimals1)
            const d = (inverted ? valueUnits : scale) * 10n ** BigInt(decimals0)
            const sqrt = parseStartingPrice(base, quote, value, inverted)
            if (sqrt === undefined) {
              expect(
                n * Q96 ** 2n < TickMath.MIN_SQRT_RATIO ** 2n * d ||
                  n * Q96 ** 2n >= TickMath.MAX_SQRT_RATIO ** 2n * d,
              ).toBe(true)
            } else {
              expect(sqrt * sqrt * d).toBeLessThanOrEqual(n * Q96 ** 2n)
              expect((sqrt + 1n) ** 2n * d).toBeGreaterThan(n * Q96 ** 2n)
            }
          }
        }
      }
    }
  })
})

describe('deployed Stellar tick rounding', () => {
  it('matches the live manager principal at ledger 64682748', () => {
    // position_principal(4, MIN_SQRT_RATIO): L=1205905, ticks [-887220, 887220].
    // Current SDK TickMath predicts 22186427902441094189302319 instead.
    const lower = getSqrtRatioAtTick(-887220)
    expect(lower).toBe(4306310043n)
    expect(
      SqrtPriceMath.getAmount0Delta(
        lower,
        getSqrtRatioAtTick(887220),
        1205905n,
        false,
      ),
    ).toBe(22186427907593168164678433n)
  })
  it('inverts legacy boundaries and preserves zero and protocol limits', () => {
    for (const tick of [-887271, -887220, -600000, -60, -1, 0, 1, 60, 887271]) {
      const sqrt = getSqrtRatioAtTick(tick)
      expect(getTickAtSqrtRatio(sqrt - 1n)).toBe(tick - 1)
      expect(getTickAtSqrtRatio(sqrt)).toBe(tick)
      expect(getTickAtSqrtRatio(sqrt + 1n)).toBe(tick)
    }
    expect(getSqrtRatioAtTick(TickMath.MIN_TICK)).toBe(TickMath.MIN_SQRT_RATIO)
    expect(getSqrtRatioAtTick(TickMath.MAX_TICK)).toBe(TickMath.MAX_SQRT_RATIO)
    expect(getTickAtSqrtRatio(TickMath.MIN_SQRT_RATIO)).toBe(TickMath.MIN_TICK)
    expect(getTickAtSqrtRatio(TickMath.MAX_SQRT_RATIO - 1n)).toBe(
      TickMath.MAX_TICK - 1,
    )
    expect(() => getTickAtSqrtRatio(TickMath.MAX_SQRT_RATIO)).toThrow()
  })
  it('requires token1 one unit above a negative lower boundary', () => {
    const lower = getSqrtRatioAtTick(-60)
    expect(
      calculateDependentAmount('1', 'token0', 7, 7, lower, -60, 60),
    ).toEqual({ status: 'below-range', amount: '0' })
    expect(
      calculateDependentAmount('1', 'token0', 7, 7, lower + 1n, -60, 60),
    ).toEqual({ status: 'within-range', amount: '0.0000001' })
  })
})
