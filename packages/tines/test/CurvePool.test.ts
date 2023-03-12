import { BigNumberish } from '@ethersproject/bignumber'

import { closeValues, CurvePool, getBigNumber } from '../src'

const token0 = {
  name: 'Token0',
  address: 'token0_address',
  symbol: 'Token1Symbol',
}
const token1 = {
  name: 'Token1',
  address: 'token1_address',
  symbol: 'Token2Symbol',
}

function expectCloseValues(
  v1: BigNumberish,
  v2: BigNumberish,
  precision: number,
  description = '',
  additionalInfo = ''
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

function createPool(params: { A: number; fee: number; reserve0: number; reserve1: number }): CurvePool {
  return new CurvePool(
    'curve pool',
    token0,
    token1,
    params.fee,
    params.A,
    getBigNumber(params.reserve0),
    getBigNumber(params.reserve1)
  )
}

function checkSwap(pool: CurvePool, amountIn: number, direction: boolean): number {
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

  expectCloseValues(inp, amountIn, 1e-10)

  return out
}

const E33 = getBigNumber(1e33)
function checkPoolPriceCalculation(pool: CurvePool) {
  const price1 = pool.calcCurrentPriceWithoutFee(true)
  const price2 = pool.calcCurrentPriceWithoutFee(false)

  expect(price1).toBeDefined()
  expect(price1).not.toBeNaN()
  expect(price1).toBeGreaterThan(0)

  expect(price2).toBeDefined()
  expect(price2).not.toBeNaN()
  expect(price2).toBeGreaterThan(0)

  expect(Math.abs(price1 * price2 - 1)).toBeLessThan(1e-9)

  let poolScaled = pool
  if (pool.reserve0.lt(E33) || pool.reserve1.lt(E33)) {
    poolScaled = new CurvePool( // Scale E21 times
      pool.address,
      pool.token0,
      pool.token1,
      pool.fee,
      pool.A,
      pool.getReserve0().mul(E33),
      pool.getReserve1().mul(E33)
    )
  }
  const inp = parseFloat(poolScaled.reserve0.toString()) / 1e15
  const { out } = poolScaled.calcOutByIn(inp / (1 - pool.fee), true)
  const expected_price = out / inp

  expect(Math.abs(price1 / expected_price - 1)).toBeLessThan(1e-7)
}

describe('Curve1 2 tokens pools check', () => {
  it('TypicalPool', () => {
    const pool = createPool({ A: 2000, fee: 1e-4, reserve0: 1e13, reserve1: 1e13 })
    checkSwap(pool, 1e8, true)
    checkSwap(pool, 1e8, false)
    checkPoolPriceCalculation(pool)
  })
})
