import { default as seedrandom } from 'seedrandom'
import { Address } from 'viem'
import { describe, expect, it } from 'vitest'
import {
  CLRPool,
  CLTick,
  CL_MAX_TICK,
  CL_MIN_TICK,
  getBigInt,
} from '../../src/tines/index.js'

const testSeed = '2' // Change it to change random generator values
const rnd: () => number = seedrandom(testSeed) // random [0, 1)

const two96 = 2 ** 96
const two96BI = 2n ** 96n

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

function addTick(ticks: CLTick[], index: number, L: bigint) {
  const fromIndex = ticks.findIndex((t) => t.index >= index)
  if (fromIndex === -1) {
    ticks.push({ index, DLiquidity: L })
  } else {
    const fromTick = ticks[fromIndex] as CLTick
    if (fromTick.index === index) {
      fromTick.DLiquidity += L
    } else {
      ticks.splice(fromIndex, 0, { index, DLiquidity: L })
    }
  }
}

function addLiquidity(pool: CLRPool, from: number, to: number, L: bigint) {
  console.assert(from >= CL_MIN_TICK && from < to && to <= CL_MAX_TICK)
  console.assert(
    (from / pool.tickSpacing) % 2 === 0 && (to / pool.tickSpacing) % 2 !== 0,
    `${from} - ${to}`,
  )
  console.assert(L >= 0n)
  addTick(pool.ticks, from, L)
  addTick(pool.ticks, to, L)
}

function getTickPrice(pool: CLRPool, tick: number): number {
  return Math.sqrt(1.0001 ** (pool.ticks[tick] as CLTick).index)
}

function getTickLiquidity(pool: CLRPool, tick: number): bigint {
  let L = 0n
  for (let i = 0; i <= tick; ++i) {
    const tick = pool.ticks[i] as CLTick
    if (tick.index % 2 === 0) {
      L = L + tick.DLiquidity
    } else {
      L = L - tick.DLiquidity
    }
  }
  return L
}

function getRandomRange(rnd: () => number, tickSpacing: number) {
  const min = Math.floor(CL_MIN_TICK / 2 / tickSpacing)
  const max = Math.floor(CL_MAX_TICK / 2 / tickSpacing)
  for (;;) {
    const tick1 = Math.floor(getRandomLin(rnd, min, max + 1))
    const tick2 = Math.floor(getRandomLin(rnd, min, max + 1))
    if (tick1 === tick2) continue
    const lower = Math.min(tick1, tick2) * 2 * tickSpacing
    const upper = Math.max(tick1, tick2) * 2 * tickSpacing + tickSpacing
    return [lower, upper]
  }
}

function getRandomCLPool(
  rnd: () => number,
  rangeNumber: number,
  minLiquidity: number,
  maxLiquidity: number,
): CLRPool {
  const tickSpacing = rnd() > 0.5 ? 5 : 60
  const pool = new CLRPool(
    'CLRPool' as Address,
    { name: 'Token0', address: 'Token0', symbol: 'Token0Symbol', decimals: 18 },
    { name: 'Token1', address: 'Token1', symbol: 'Token0Symbol', decimals: 18 },
    0.003,
    tickSpacing,
    0n,
    0n,
    0n,
    two96BI,
    -1,
    [],
  )

  for (let i = 0; i < rangeNumber; ++i) {
    const [low, high] = getRandomRange(rnd, tickSpacing) as [number, number]
    const liquidity = getRandomExp(rnd, minLiquidity, maxLiquidity)
    addLiquidity(pool, low, high, getBigInt(liquidity))
  }

  pool.nearestTick = Math.floor(getRandomLin(rnd, 0, pool.ticks.length - 1))
  const tickPrice = getTickPrice(pool, pool.nearestTick)
  const nextTickPrice = getTickPrice(pool, pool.nearestTick + 1)
  pool.sqrtPriceX96 = getBigInt(
    getRandomLin(rnd, tickPrice, nextTickPrice) * two96,
  )
  pool.liquidity = getTickLiquidity(pool, pool.nearestTick)

  return pool
}

function getMaxInputApprox(pool: CLRPool, direction: boolean): number {
  let prevOutput = -1
  let input = 10
  // biome-ignore lint/correctness/noConstantCondition: <explanation>
  while (1) {
    const output = pool.calcOutByIn(input, direction).out
    if (output === prevOutput) {
      return input / 2
    }
    input *= 2
    prevOutput = output
  }
  return -1
}

describe('CL pool test', () => {
  it('0->0', () => {
    const pool = getRandomCLPool(rnd, 2, 100, 1e10)
    expect(pool.calcOutByIn(0, true).out).toEqual(0)
    expect(pool.calcOutByIn(0, false).out).toEqual(0)
    expect(pool.calcInByOut(0, true).inp).toEqual(0)
    expect(pool.calcInByOut(0, false).inp).toEqual(0)
  })

  const expectedCalculationPrecision = 1e-12
  it('in->out->in2 = in', () => {
    const calcTestNumber = 400
    for (let p = 0; p < 100; ++p) {
      const pool = getRandomCLPool(rnd, 100, 100, 1e6)
      const maxXInput = getMaxInputApprox(pool, true)
      const maxYInput = getMaxInputApprox(pool, false)
      for (let i = 0; i < calcTestNumber; ++i) {
        const direction = rnd() > 0.5
        const maxInput = direction ? maxXInput : maxYInput
        const input = getRandomExp(rnd, 1, maxInput * 1.2)
        const output = pool.calcOutByIn(input, direction).out
        const input2 = pool.calcInByOut(output, direction).inp
        const output2 = pool.calcOutByIn(input2, direction).out
        const precision1 = Math.abs(input / input2 - 1)
        const precision2 = Math.abs(output / output2 - 1)
        expect(
          precision1 < expectedCalculationPrecision ||
            precision2 < expectedCalculationPrecision,
        )
      }
    }
  })
})
