import seedrandom from 'seedrandom'
import { Address } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  CurvePool,
  RToken,
  closeValues,
  getBigInt,
} from '../../src/tines/index.js'

const token0 = {
  name: 'Token0',
  address: 'token0_address',
  symbol: 'Token0Symbol',
  decimals: 18,
}
const token1 = {
  name: 'Token1',
  address: 'token1_address',
  symbol: 'Token1Symbol',
  decimals: 18,
}
const token2 = {
  name: 'Token2',
  address: 'token2_address',
  symbol: 'Token2Symbol',
  decimals: 6,
}
const token3 = {
  name: 'Token3',
  address: 'token3_address',
  symbol: 'Token3Symbol',
  decimals: 6,
}

export function getRandomLin(rnd: () => number, min: number, max: number) {
  return rnd() * (max - min) + min
}

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function expectCloseValues(
  v1: number,
  v2: number,
  precision: number,
  description = '',
  additionalInfo = '',
) {
  const a = v1
  const b = v2
  const res = closeValues(a, b, precision)
  if (!res) {
    console.log('Close values expectation failed:', description)
    console.log('v1 =', a)
    console.log('v2 =', b)
    console.log('precision =', Math.abs(a / b - 1), ', expected <', precision)
    if (additionalInfo !== '') {
      console.log(additionalInfo)
    }
  }
  expect(res).toBeTruthy()
  return res
}

function createPool(
  params: { A: number; fee: number; reserve0: number; reserve1: number },
  token0: RToken,
  token1: RToken,
): CurvePool {
  return new CurvePool(
    'curve pool' as Address,
    token0,
    token1,
    params.fee,
    params.A,
    getBigInt(params.reserve0),
    getBigInt(params.reserve1),
  )
}

function checkSwap(
  pool: CurvePool,
  amountIn: number,
  direction: boolean,
): number {
  const { out, gasSpent } = pool.calcOutByIn(amountIn, direction)

  expect(gasSpent).toBeDefined()
  expect(gasSpent).not.toBeNaN()
  expect(gasSpent).toBeGreaterThan(0)

  expect(out).toBeDefined()
  expect(out).not.toBeNaN()
  expect(out).toBeGreaterThanOrEqual(0)

  const { inp, gasSpent: gasSpent2 } = pool.calcInByOut(out, direction)

  expect(gasSpent2).toBeDefined()
  expect(gasSpent2).not.toBeNaN()
  expect(gasSpent2).toBeGreaterThan(0)

  expect(inp).toBeDefined()
  expect(inp).not.toBeNaN()
  expect(inp).toBeGreaterThanOrEqual(0)

  const expectedPrecision = Math.max(1e-10, 100 / out, 100 / inp)

  expectCloseValues(
    inp,
    amountIn,
    expectedPrecision,
    `price=${pool.calcCurrentPriceWithoutFee(
      true,
    )} res0=${pool.reserve0.toString()} res1=${pool.reserve1.toString()} amountIn=${amountIn} out=${out} inp=${inp} dir=${direction}`,
  )

  return out
}

const E33 = getBigInt(1e33)
function checkPoolPriceCalculation(pool: CurvePool) {
  const price1 = pool.calcCurrentPriceWithoutFee(true)
  const price2 = pool.calcCurrentPriceWithoutFee(false)

  expect(price1).toBeDefined()
  expect(price1).not.toBeNaN()
  expect(price1).toBeGreaterThan(0)

  expect(price2).toBeDefined()
  expect(price2).not.toBeNaN()
  expect(price2).toBeGreaterThan(0)

  const expectedPrecision = Math.max(
    1e-10,
    10 / parseInt(pool.reserve0.toString()),
    10 / parseInt(pool.reserve1.toString()),
  )
  expect(Math.abs(price1 * price2 - 1)).toBeLessThan(expectedPrecision)

  let poolScaled = pool
  if (pool.reserve0 < E33 || pool.reserve1 < E33) {
    poolScaled = new CurvePool(
      // Scale E21 times
      pool.address,
      pool.token0,
      pool.token1,
      pool.fee,
      pool.A,
      pool.getReserve0() * E33,
      pool.getReserve1() * E33,
    )
  }
  const inp = parseFloat(poolScaled.reserve0.toString()) / 1e15
  const { out } = poolScaled.calcOutByIn(inp / (1 - pool.fee), true)
  const expected_price = out / inp

  expect(Math.abs(price1 / expected_price - 1)).toBeLessThan(expectedPrecision)
}

function createRandomPool(rnd: () => number, token0: RToken, token1: RToken) {
  const reserve0 = 10 ** token0.decimals * getRandomExp(rnd, 1, 1e12)
  return createPool(
    {
      A: Math.round(getRandomExp(rnd, 1, 10_000)),
      fee: Math.round(getRandomLin(rnd, 1, 100)) / 10_000,
      reserve0,
      reserve1:
        reserve0 *
        10 ** (token1.decimals - token0.decimals) *
        getRandomExp(rnd, 1 / 1000, 1000),
    },
    token0,
    token1,
  )
}

describe('Curve1 2 tokens pools check', () => {
  it('TypicalPool', () => {
    const pool = createPool(
      { A: 2000, fee: 1e-4, reserve0: 1e13, reserve1: 1e13 },
      token0,
      token1,
    )
    checkSwap(pool, 1e8, true)
    checkSwap(pool, 1e8, false)
    checkPoolPriceCalculation(pool)
  })

  it('Random test decimals 18-18', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = `18-18_${p}`
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const pool = createRandomPool(rnd, token0, token1)
      checkPoolPriceCalculation(pool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })

  it('Random test decimals 18-6', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = `18-6_${p}`
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const pool = createRandomPool(rnd, token1, token2)
      checkPoolPriceCalculation(pool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })

  it('Random test decimals 6-6', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = `6-6_${p}`
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const pool = createRandomPool(rnd, token2, token3)
      checkPoolPriceCalculation(pool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })
})
