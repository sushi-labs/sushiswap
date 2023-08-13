import { CL_MAX_TICK, CL_MIN_TICK, getBigNumber, UniV3Pool } from '@sushiswap/tines'
import { expect } from 'chai'
import { BigNumber, BigNumberish, Contract } from 'ethers'
import { ethers } from 'hardhat'
import seedrandom from 'seedrandom'

import { createRandomUniV3Pool, createUniV3EnvZero, createUniV3Pool, UniV3Environment } from '../src'

// Map of fee to tickSpacing
const feeAmountTickSpacing: number[] = []
feeAmountTickSpacing[500] = 10 // 0.05%
feeAmountTickSpacing[3000] = 60 // 0.3%
feeAmountTickSpacing[10000] = 200 // 1%

function closeValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number): boolean {
  const a: number = typeof _a == 'number' ? _a : parseInt(_a.toString())
  const b: number = typeof _b == 'number' ? _b : parseInt(_b.toString())
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

function expectCloseValues(_a: number | BigNumber, _b: number | BigNumber, accuracy: number, logInfoIfFalse = '') {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).true
  }
  return res
}

interface PoolInfo {
  contract: Contract
  tinesPool: UniV3Pool
  token0Contract: Contract
  token1Contract: Contract
}

export async function getPoolState(pool: Contract) {
  const slot = await pool.slot0()
  const PoolState = {
    liquidity: await pool.liquidity(),
    tickSpacing: await pool.tickSpacing(),
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }
  return PoolState
}

// EVM calculations with 256 integers are not very precise in case of small numbers.
// It impacts calcOutByIn calculation for extremely big/small prices
// This function sets output precision calculation depending on current pool price
function expectedPrecision(sqrtPriceX96Before: BigNumber, sqrtPriceX96After: BigNumber): number {
  const sqrtPrice1 = parseInt(sqrtPriceX96Before.toString()) / Math.pow(2, 96)
  let price1 = sqrtPrice1 * sqrtPrice1
  price1 = price1 < 1 ? 1 / price1 : price1
  const sqrtPrice2 = parseInt(sqrtPriceX96After.toString()) / Math.pow(2, 96)
  let price2 = sqrtPrice2 * sqrtPrice2
  price2 = price2 < 1 ? 1 / price2 : price2
  const maxPrice = Math.max(price1, price2)
  //console.log(price1, price2)
  if (maxPrice < 1e15) return 1e-12
  if (maxPrice < 1e20) return 1e-9
  if (maxPrice < 1e29) return 1e-5
  if (maxPrice < 1e32) return 1e-4
  return 1e-2
}

function checkCalcInByOut(pool: UniV3Pool, amountIn: number, direction: boolean, amountOut: number) {
  const amounInExpected = pool.calcInByOut(amountOut, direction).inp
  const amountOutPrediction2 = pool.calcOutByIn(amounInExpected, direction).out
  expect(closeValues(amountIn, amounInExpected, 1e-12) || closeValues(amountOut, amountOutPrediction2, 1e-12)).equals(
    true,
    'values were not equal'
  )
}

function checkPrice(pool: UniV3Pool) {
  const price1 = pool.calcCurrentPriceWithoutFee(true)
  const price2 = pool.calcCurrentPriceWithoutFee(false)
  expectCloseValues(price1 * price2, 1, 1e-12)
  if (pool.liquidity.lt(1e12)) {
    return // price test can fail because of test issues
  }

  const direction = price2 >= 1
  const currentTick = Math.log(price1) / Math.log(1.0001) / 2
  const nextIndex = direction ? pool.nearestTick : pool.nearestTick + 1
  if (nextIndex >= pool.ticks.length) return // price test can fail because of test issues
  const nextTick = pool.ticks[nextIndex].index
  if (Math.abs(currentTick - nextTick) < 100) {
    return // price test can fail because of test issues
  }

  const inp = 1e9
  let realPrice = 0
  try {
    const out = pool.calcOutByIn(inp, direction).out
    realPrice = out / inp
  } catch (e) {
    return
  }
  expectCloseValues(direction ? price1 : price2, realPrice, 10 / inp)
}

async function checkSwap(
  env: UniV3Environment,
  pool: PoolInfo,
  amount: number | BigNumberish,
  direction: boolean,
  updateTinesPool = false,
  printTick = false
) {
  const slotBefore = await pool.contract.slot0()

  if (updateTinesPool) {
    // update tines pool data
    pool.tinesPool.updateState(
      await pool.token0Contract.balanceOf(pool.contract.address),
      await pool.token1Contract.balanceOf(pool.contract.address),
      slotBefore[1], // tick
      await pool.contract.liquidity(),
      slotBefore[0] // price
    )
  }

  if (typeof amount == 'number') amount = Math.round(amount) // input should be integer
  const amountBN: BigNumber = typeof amount == 'number' ? getBigNumber(amount) : BigNumber.from(amount)
  const amountN: number = typeof amount == 'number' ? amount : parseInt(amount.toString())
  const [inToken, outToken] = direction
    ? [pool.token0Contract, pool.token1Contract]
    : [pool.token1Contract, pool.token0Contract]
  const inBalanceBefore = await inToken.balanceOf(env.user.getAddress())
  const outBalanceBefore = await outToken.balanceOf(env.user.getAddress())
  const tickBefore = slotBefore[1]
  await env.swapper.swap(pool.contract.address, direction, amountBN)
  const slotAfter = await pool.contract.slot0()
  const tickAfter = slotAfter[1]
  const inBalanceAfter = await inToken.balanceOf(env.user.getAddress())
  const outBalanceAfter = await outToken.balanceOf(env.user.getAddress())
  if (printTick) console.log(tickBefore, '->', tickAfter)

  const precision = expectedPrecision(slotBefore[0], slotAfter[0])

  const amountOut = outBalanceAfter.sub(outBalanceBefore)
  const amountIn: BigNumber = inBalanceBefore.sub(inBalanceAfter)
  if (amountIn.eq(amountBN)) {
    // all input value were swapped to output
    const amounOutTines = pool.tinesPool.calcOutByIn(amountN, direction)
    expectCloseValues(amountOut, amounOutTines.out, precision)
    checkCalcInByOut(pool.tinesPool, amountN, direction, amounOutTines.out)
    checkPrice(pool.tinesPool)
  } else {
    // out of liquidity
    expect(amountIn.lt(amountBN)).true
    let errorThrown = false
    let amounOutTines = 0
    try {
      amounOutTines = pool.tinesPool.calcOutByIn(amountN, direction).out
    } catch (e) {
      errorThrown = true
    }
    if (!errorThrown) {
      expectCloseValues(amountOut, amounOutTines, precision)
    }
  }
}

const minPrice = Math.pow(1.0001, CL_MIN_TICK)
const maxPrice = Math.pow(1.0001, CL_MAX_TICK)
async function getRandomSwapParams(rnd: () => number, pool: PoolInfo): Promise<[number, boolean]> {
  const slot = await pool.contract.slot0()
  const sqrtPrice = parseInt(slot[0].toString()) / Math.pow(2, 96)
  const price = sqrtPrice * sqrtPrice // res1/res0

  let direction = true
  if (price < minPrice * 10) direction = false
  else if (price > maxPrice / 10) direction = true
  else direction = rnd() > 0.5

  const res0BI = await pool.token0Contract.balanceOf(pool.contract.address)
  const res0 = parseInt(res0BN.toString())
  const res1BI = await pool.token1Contract.balanceOf(pool.contract.address)
  const res1 = parseInt(res1BN.toString())

  const maxRes = direction ? res1 / price : res0 * price
  const amount = Math.round(rnd() * maxRes) + 1000

  //console.log('current price:', price, 'amount:', amount, 'direction:', direction)

  return [amount, direction]
}

async function monkeyTest(env: UniV3Environment, pool: PoolInfo, seed: string, iterations: number, printTick = false) {
  const rnd: () => number = seedrandom(seed) // random [0, 1)
  for (let i = 0; i < iterations; ++i) {
    const [amount, direction] = await getRandomSwapParams(rnd, pool)
    await checkSwap(env, pool, amount, direction, true, printTick)
  }
}

describe('Uni V3', () => {
  let env: UniV3Environment

  before(async () => {
    env = await createUniV3EnvZero(ethers)
  })

  it('Empty pool', async () => {
    const pool = await createUniV3Pool(env, 3000, 1, [])
    await checkSwap(env, pool, 100, true)
    await checkSwap(env, pool, 100, false)
  })

  describe('One position', () => {
    it('No tick crossing', async () => {
      const pool = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e16, true)
      const pool2 = await createUniV3Pool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e16, false)
    })

    it('Tick crossing', async () => {
      const pool = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      const pool2 = await createUniV3Pool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e20, false)
    })

    it('Swap exact to tick', async () => {
      const pool = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, '616469173272709204', true) // before tick
      const pool2 = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, '616469173272709205', true) // after tick
      const pool3 = await createUniV3Pool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool3, '460875064077414607', false) // before tick
      const pool4 = await createUniV3Pool(env, 3000, 4, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool4, '460875064077414607', false) // after tick
    })

    it('From 0 zone to not 0 zone', async () => {
      const pool = await createUniV3Pool(env, 3000, 50, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e17, true)
      // const pool2 = await createUniV3Pool(env, 3000, 0.1, [{ from: -1200, to: 18000, val: 1e18 }])
      // await checkSwap(env, pool2, 1e17, false)
    })

    it('From 0 zone through ticks to 0 zone', async () => {
      const pool = await createUniV3Pool(env, 3000, 50, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      const pool2 = await createUniV3Pool(env, 3000, 0.1, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool2, 1e19, false)
    })

    it('Special case 1', async () => {
      const pool = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await checkSwap(env, pool, 1e18, true)
      await checkSwap(env, pool, 1, false, true)
    })

    it.skip('Monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 5, [{ from: -1200, to: 18000, val: 1e18 }])
      await monkeyTest(env, pool, 'test1', 1000, true)
    })
  })

  describe('Two positions', () => {
    it('Special 1', async () => {
      const pool = await createUniV3Pool(env, 3000, 12.310868067131443, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await checkSwap(env, pool, 85433172055732540, true)
    })
    it('Special 2', async () => {
      const pool = await createUniV3Pool(env, 3000, 121.48126046130433, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await checkSwap(env, pool, '154350003013680480', true)
    })
    it('Special 3', async () => {
      const pool = await createUniV3Pool(env, 3000, 6.857889404362659, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await checkSwap(env, pool, '994664157591385500', true)
    })
    it('No overlapping small monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 3, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await monkeyTest(env, pool, 'small', 10)
    })
    it.skip('No overlapping big monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 3, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 24000, to: 48000, val: 5e18 },
      ])
      await monkeyTest(env, pool, 'big', 1000, true)
    })
    it('Touching positions small monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 4, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 18000, to: 42000, val: 5e18 },
      ])
      await monkeyTest(env, pool, '_small', 10)
    })
    it.skip('Touching positions big monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 4, [
        { from: -1200, to: 18000, val: 1e18 },
        { from: 18000, to: 42000, val: 5e18 },
      ])
      await monkeyTest(env, pool, '_big', 1000, true)
    })
    it('Overlapped positions small monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 8, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await monkeyTest(env, pool, 'Small', 10)
    })
    it.skip('Overlapped positions small monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 8, [
        { from: -1200, to: 18000, val: 2e18 },
        { from: 12000, to: 24000, val: 6e18 },
      ])
      await monkeyTest(env, pool, 'Big', 1000, true)
    })
    it('Nested positions small monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 8, [
        { from: -1200, to: 24000, val: 2e18 },
        { from: 6000, to: 12000, val: 6e18 },
      ])
      await monkeyTest(env, pool, '_small_', 10)
    })
    it.skip('Nested positions big monkey test', async () => {
      const pool = await createUniV3Pool(env, 3000, 8, [
        { from: -1200, to: 24000, val: 2e18 },
        { from: 6000, to: 12000, val: 6e18 },
      ])
      await monkeyTest(env, pool, '_big_', 1000, true)
    })
  })
  it.skip('Random pool monkey test', async () => {
    for (let i = 0; i < 10; ++i) {
      const pool = await createRandomUniV3Pool(env, 'pool' + i, 100)
      await monkeyTest(env, pool, 'monkey' + i, 100, true)
    }
  })
})
