import seedrandom from 'seedrandom'

import { RToken } from '../dist'
import {
  closeValues,
  createCurvePoolsSingleForMultipool,
  CurveMultitokenPool,
  CurvePool,
  getBigInt,
} from '../src'

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
  v1: bigint | number,
  v2: bigint | number,
  precision: number,
  description = '',
  additionalInfo = '',
) {
  const a = typeof v1 == 'number' ? v1 : parseFloat(v1.toString())
  const b = typeof v2 == 'number' ? v2 : parseFloat(v2.toString())
  const res = closeValues(a, b, precision)
  if (!res) {
    console.log('Close values expectation failed:', description)
    console.log('v1 =', a)
    console.log('v2 =', b)
    console.log('precision =', Math.abs(a / b - 1), ', expected <', precision)
    if (additionalInfo != '') {
      console.log(additionalInfo)
    }
  }
  expect(res).toBeTruthy()
  return res
}

function createPool(
  params: {
    A: number
    fee: number
    reserve0: bigint
    reserve1: bigint
    ratio: number
  },
  token0: RToken,
  token1: RToken,
): CurvePool {
  return new CurvePool(
    '0xcurve pool',
    token0,
    token1,
    params.fee,
    params.A,
    params.reserve0,
    params.reserve1,
    params.ratio,
  )
}

function createMultiPool(
  params: {
    A: number
    fee: number
    reserve0: bigint
    reserve1: bigint
    ratio: number
  },
  token0: RToken,
  token1: RToken,
): CurveMultitokenPool {
  return createCurvePoolsSingleForMultipool(
    'curve multipool',
    [token0, token1],
    params.fee,
    params.A,
    [params.reserve0, params.reserve1],
    [1, params.ratio],
  )[0] as CurveMultitokenPool
}

function checkSwap(
  pool: CurvePool,
  multipool: CurveMultitokenPool,
  amountIn: number,
  direction: boolean,
): number {
  const { out, gasSpent } = pool.calcOutByIn(amountIn, direction)
  const res1 = multipool.calcOutByIn(amountIn, direction)

  expect(res1.out).toEqual(out)
  expect(res1.gasSpent).toEqual(gasSpent)

  const { inp, gasSpent: gasSpent2 } = pool.calcInByOut(out, direction)
  const res2 = multipool.calcInByOut(out, direction)

  expect(res2.inp).toEqual(inp)
  expect(res2.gasSpent).toEqual(gasSpent2)

  return out
}

function checkPoolPriceCalculation(
  pool: CurvePool,
  multipool: CurveMultitokenPool,
) {
  const price1 = pool.calcCurrentPriceWithoutFee(true)
  const price1M = multipool.calcCurrentPriceWithoutFee(true)
  expectCloseValues(price1M, price1, 1e-12)

  const price2 = pool.calcCurrentPriceWithoutFee(false)
  const price2M = multipool.calcCurrentPriceWithoutFee(false)
  expectCloseValues(price2M, price2, 1e-12)
}

function createRandomPool(rnd: () => number, token0: RToken, token1: RToken) {
  const reserve0 = Math.pow(10, token0.decimals) * getRandomExp(rnd, 1, 1e12)
  const params = {
    A: Math.round(getRandomExp(rnd, 1, 10_000)),
    fee: Math.round(getRandomLin(rnd, 1, 100)) / 10_000,
    reserve0: getBigInt(reserve0),
    reserve1: getBigInt(
      reserve0 *
        Math.pow(10, token1.decimals - token0.decimals) *
        getRandomExp(rnd, 1 / 1000, 1000),
    ),
    ratio: getRandomExp(rnd, 0.5, 2),
  }
  return {
    pool: createPool(params, token0, token1),
    multipool: createMultiPool(params, token0, token1),
  }
}

describe('Curve pool-multipool tests', () => {
  it('Random test decimals 18-18', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = '18-18_' + p
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const { pool, multipool } = createRandomPool(rnd, token0, token1)
      checkPoolPriceCalculation(pool, multipool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })

  it('Random test decimals 18-6', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = '18-6_' + p
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const { pool, multipool } = createRandomPool(rnd, token1, token2)
      checkPoolPriceCalculation(pool, multipool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })

  it('Random test decimals 6-6', () => {
    for (let p = 0; p < 30; ++p) {
      const testSeed = '6-6_' + p
      const rnd: () => number = seedrandom(testSeed) // random [0, 1)
      const { pool, multipool } = createRandomPool(rnd, token2, token3)
      checkPoolPriceCalculation(pool, multipool)
      for (let i = 0; i < 30; ++i) {
        const amountInPortion = getRandomExp(rnd, 1e-5, 1e-1)
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve0().toString()) * amountInPortion,
          true,
        )
        checkSwap(
          pool,
          multipool,
          parseInt(pool.getReserve1().toString()) * amountInPortion,
          false,
        )
      }
    }
  })
})
