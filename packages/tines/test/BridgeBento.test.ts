import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import seedrandom from 'seedrandom'
import { _1e12 } from '../../math/dist'
import { RToken } from '../dist'
import { BridgeBento, getBigNumber } from '../src'

function closeValues(a: number, b: number, accuracy: number, logInfoIfFalse = ''): boolean {
  if (a === b) return true
  if (accuracy === 0) return a === b
  if (a == 0) return b < accuracy
  if (b == 0) return a < accuracy
  const res = Math.abs(a / b - 1) < accuracy
  return res
}

function calcPrecision(a: number, b: number): number {
  if (a === b) return 0
  if (a == 0) return b
  if (b == 0) return a
  return Math.abs(a / b - 1)
}

function expectCloseValues(
  v1: BigNumberish,
  v2: BigNumberish,
  precisionExpected: number,
  description = '',
  additionalInfo = ''
) {
  const a = typeof v1 == 'number' ? v1 : parseFloat(v1.toString())
  const b = typeof v2 == 'number' ? v2 : parseFloat(v2.toString())
  const precision = calcPrecision(a, b)
  if (precision > precisionExpected) {
    console.log('Close values expectation failed:', description)
    console.log('v1 =', a)
    console.log('v2 =', b)
    console.log('precision =', precision, ', expected <', precisionExpected)
    if (additionalInfo != '') {
      console.log(additionalInfo)
    }
  }
  expect(precision <= precisionExpected).toBeTruthy()
  return precision <= precisionExpected
}

function checkBridging(bridge: BridgeBento, amount: number) {
  const share = bridge.calcOutByIn(amount, true).out

  const amount2 = bridge.calcOutByIn(share, false).out
  expectCloseValues(amount, amount2, 1e-10)

  const amount3 = bridge.calcInByOut(share, true).inp
  expectCloseValues(amount, amount3, 1e-10)

  const share2 = bridge.calcInByOut(amount, false).inp
  expectCloseValues(share, share2, 1e-10)

  if (amount != 0) {
    const price = bridge.calcCurrentPriceWithoutFee(true)
    expectCloseValues(share / amount, price, 1e-10)
  }

  if (share != 0) {
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
  }
  const token2: RToken = {
    name: 'token2',
    symbol: 'token2',
    address: 'token2',
  }
  const elastic = rnd() < 0.2 ? 0 : getRandomExp(rnd, 1, 1e20)
  const base = rnd() < 0.2 ? 0 : getRandomExp(rnd, 1, 1e20)

  return new BridgeBento('aaa', token1, token2, getBigNumber(elastic), getBigNumber(base))
}

function getBridge(elastic: number, base: number) {
  const token1: RToken = {
    name: 'token1',
    symbol: 'token1',
    address: 'token1',
  }
  const token2: RToken = {
    name: 'token2',
    symbol: 'token2',
    address: 'token2',
  }
  return new BridgeBento('aaa', token1, token2, getBigNumber(elastic), getBigNumber(base))
}

describe('Bento Bridge test', () => {
  it('Zero bridge', () => {
    const rnd: () => number = seedrandom('0') // random [0, 1)
    const bridge = getBridge(0, 0)
    checkBridging(bridge, 0)
    for (let i = 0; i < 100; ++i) {
      const amount = getRandomExp(rnd, 1, 1e20)
      checkBridging(bridge, amount)
    }
  })
})
