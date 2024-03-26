import seedrandom from 'seedrandom'
import { describe, expect, it } from 'vitest'
import { BridgeBento, RToken, getBigInt } from '../../src/tines/index.js'

function calcPrecision(a: number, b: number): number {
  if (a === b) return 0
  if (a === 0) return b
  if (b === 0) return a
  return Math.abs(a / b - 1)
}

function expectCloseValues(
  v1: number,
  v2: number,
  precisionExpected: number,
  description = '',
  additionalInfo = '',
) {
  // const a = typeof v1 === 'number' ? v1 : parseFloat(v1.toString())
  // const b = typeof v2 === 'number' ? v2 : parseFloat(v2.toString())
  const a = v1
  const b = v2
  const precision = calcPrecision(a, b)
  if (precision > precisionExpected) {
    console.log(
      `Close values expectation failed: ${description}
      v1 = ${a}\
      v2= ${b}\
      precision = ${precision}, expected < ${precisionExpected}`,
    )
    if (additionalInfo !== '') {
      console.log(additionalInfo)
    }
    // debugger
  }
  expect(precision <= precisionExpected).toBeTruthy()
  return precision <= precisionExpected
}

function checkBridging(bridge: BridgeBento, amount: number) {
  const share = bridge.calcOutByIn(amount, true).out

  try {
    const amount2 = bridge.calcOutByIn(share, false).out
    expectCloseValues(amount, amount2, 1e-10)
  } catch (_e) {
    expect(bridge.freeLiquidity).toBeDefined()
    let out
    if (bridge.base === 0) {
      out = share
    } else {
      out = (share * bridge.elastic) / bridge.base
    }
    expect(out).toBeGreaterThan(bridge.freeLiquidity as number)
  }

  const amount3 = bridge.calcInByOut(share, true).inp
  expectCloseValues(amount, amount3, 1e-10)

  const share2 = bridge.calcInByOut(amount, false).inp
  if (bridge.freeLiquidity !== undefined && amount > bridge.freeLiquidity) {
    expect(share2).toEqual(Number.POSITIVE_INFINITY)
  } else {
    expectCloseValues(share, share2, 1e-10)
  }

  if (amount !== 0) {
    const price = bridge.calcCurrentPriceWithoutFee(true)
    expectCloseValues(share / amount, price, 1e-10)
  }

  if (share !== 0) {
    const price = bridge.calcCurrentPriceWithoutFee(false)
    expectCloseValues(amount / share, price, 1e-10)
  }
}

export function getRandomExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

function getRandomBridge(rnd: () => number) {
  const token1: RToken = {
    name: 'token1',
    symbol: 'token1',
    address: 'token1',
    decimals: 18,
  }
  const token2: RToken = {
    name: 'token2',
    symbol: 'token2',
    address: 'token2',
    decimals: 18,
  }
  const elastic = Math.floor(getRandomExp(rnd, 1, 1e20))
  const base = Math.floor(getRandomExp(rnd, 1, 1e20))

  return new BridgeBento(
    'aaa',
    token1,
    token2,
    getBigInt(elastic),
    getBigInt(base),
    getBigInt(elastic / 2),
  )
}

function getBridge(elastic: number, base: number) {
  const token1: RToken = {
    name: 'token1',
    symbol: 'token1',
    address: 'token1',
    decimals: 18,
  }
  const token2: RToken = {
    name: 'token2',
    symbol: 'token2',
    address: 'token2',
    decimals: 18,
  }
  return new BridgeBento(
    'aaa',
    token1,
    token2,
    getBigInt(elastic),
    getBigInt(base),
  )
}

describe('Bento Bridge test', () => {
  it('elastic = 0, base = 0', () => {
    const rnd: () => number = seedrandom('0') // random [0, 1)
    const bridge = getBridge(0, 0)
    checkBridging(bridge, 0)
    for (let i = 0; i < 100; ++i) {
      const amount = getRandomExp(rnd, 1, 1e20)
      checkBridging(bridge, amount)
    }
  })

  it('Random non-zero elastic + base', () => {
    const rnd: () => number = seedrandom('1') // random [0, 1)
    for (let j = 0; j < 100; ++j) {
      const bridge = getRandomBridge(rnd)
      checkBridging(bridge, 0)
      for (let i = 0; i < 10; ++i) {
        const amount = getRandomExp(rnd, 1, 1e20)
        checkBridging(bridge, amount)
      }
    }
  })
})
