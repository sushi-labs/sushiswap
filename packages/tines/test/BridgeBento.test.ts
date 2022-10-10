import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import seedrandom from 'seedrandom'
import { _1e12 } from '../../math/dist'
import { RToken } from '../dist'
import { BridgeBento, closeValues, getBigNumber } from '../src'

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

function checkBridging(bridge: BridgeBento, amount: number) {
  const share = bridge.calcOutByIn(amount, true).out
  const amount2 = bridge.calcOutByIn(share, false).out
  expectCloseValues(amount, amount2, 1e-10)
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
      checkBridging(bridge, 0)
    }
  })
})
