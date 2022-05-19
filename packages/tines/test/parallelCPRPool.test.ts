import { ConstantProductRPool } from "../src/PrimaryPools"
import { getBigNumber } from "../src/Utils"
import { ParallelCPRPool } from "../src/ParallelCPRPool"
import { findMultiRouteExactIn } from "../src";
import seedrandom from "seedrandom";

const testSeed = "0"; // Change it to change random generator values
const rnd: () => number = seedrandom(testSeed); // random [0, 1)

function getRandom(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  console.assert(res <= max && res >= min, 'Random value is out of the range')
  return res
}

const gasPrice = 200
const token0 = {name: 'Token0', address: 'Token0Address'}
const token1 = {name: 'Token1', address: 'Token1Address'}
function getPool(reserve: number, price: number, fee: number) {
  return new ConstantProductRPool(
    'poolAddress',
    token0,
    token1,
    fee,
    getBigNumber(reserve),
    getBigNumber(reserve*price)
  )
}

// function generatePools(rnd: () => number, poolsNumber: number) {
  
// }

describe('Parallel ConstuntProduct Combo Pool', () => {
  it('One pool', () => {
    const pool = getPool(1e18, 2, 0.003)
    const comboPool1 = new ParallelCPRPool(token0, [pool], gasPrice)

    for (let i = 0; i < 10; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e17)
      const out1 = comboPool1.calcOutByIn(amountIn, true).out
      const out2 = findMultiRouteExactIn(token0, token1, amountIn, [pool], token1, gasPrice).amountOut
      expect(Math.abs(out1/out2-1)).toBeLessThan(1e-12)
    }

    for (let i = 0; i < 10; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e17)
      const out1 = comboPool1.calcOutByIn(amountIn, false).out
      const out2 = findMultiRouteExactIn(token1, token0, amountIn, [pool], token1, gasPrice).amountOut
      expect(Math.abs(out1/out2-1)).toBeLessThan(1e-12)
    }

    const comboPool2 = new ParallelCPRPool(token1, [pool], gasPrice)

    for (let i = 0; i < 10; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e17)
      const out1 = comboPool2.calcOutByIn(amountIn, false).out
      const out2 = findMultiRouteExactIn(token0, token1, amountIn, [pool], token1, gasPrice).amountOut
      expect(Math.abs(out1/out2-1)).toBeLessThan(1e-12)
    }

    for (let i = 0; i < 10; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e17)
      const out1 = comboPool2.calcOutByIn(amountIn, true).out
      const out2 = findMultiRouteExactIn(token1, token0, amountIn, [pool], token1, gasPrice).amountOut
      expect(Math.abs(out1/out2-1)).toBeLessThan(1e-12)
    }
  })

  it('Several equal pools', () => {
    const pools = []
    for (let i = 0; i < 7; ++i) {
      pools.push(getPool(1e18, 2, 0.003))
      const comboPool = new ParallelCPRPool(token0, pools, gasPrice)

      for (let i = 0; i < 100; ++i) {
        const amountIn = getRandom(rnd, 1e3, 1e20)
        const {out, gasSpent} = comboPool.calcOutByIn(amountIn, true)
        const ta = out - gasSpent*gasPrice
        const {totalAmountOut} = findMultiRouteExactIn(token0, token1, amountIn, pools, token1, gasPrice)
        expect(totalAmountOut).toBeLessThanOrEqual(ta > 0 ? ta*(1+1e-12):ta*(1-1e-12))
      }
    }    
  })

  it('1+3 pools', () => {
    const pools = [
      getPool(1e18, 2, 0.003),
      getPool(1e18, 2, 0.003),
      getPool(1e19, 2, 0.003),
      getPool(1e18, 2, 0.003)
    ]
    const comboPool = new ParallelCPRPool(token0, pools, gasPrice)
    
    for (let i = 0; i < 100; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e20)
      const {out, gasSpent} = comboPool.calcOutByIn(amountIn, true)
      const ta = out - gasSpent*gasPrice
      const {totalAmountOut} = findMultiRouteExactIn(token0, token1, amountIn, pools, token1, gasPrice)
      expect(totalAmountOut).toBeLessThanOrEqual(ta > 0 ? ta*(1+1e-12):ta*(1-1e-12))
    } 
  })

  it('best price pool', () => {
    const pools = [
      getPool(1e18, 2, 0.003),
      getPool(1e19, 2, 0.003),
      getPool(1e18, 2.02, 0.003),
      getPool(1e18, 2, 0.003)
    ]
    const comboPool = new ParallelCPRPool(token0, pools, gasPrice)
    
    for (let i = 0; i < 100; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e20)
      const {out, gasSpent} = comboPool.calcOutByIn(amountIn, true)
      const ta = out - gasSpent*gasPrice
      const {totalAmountOut} = findMultiRouteExactIn(token0, token1, amountIn, pools, token1, gasPrice)
      expect(totalAmountOut).toBeLessThanOrEqual(ta > 0 ? ta*(1+1e-12):ta*(1-1e-12))
    } 
  })

  it('weak pool', () => {
    const pools = [
      getPool(1e8, 2, 0.003),
      getPool(1e19, 2, 0.003),
      getPool(1e18, 2.02, 0.003),
      getPool(1e18, 2, 0.003)
    ]
    const comboPool = new ParallelCPRPool(token0, pools, gasPrice)
    
    for (let i = 0; i < 100; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e25)
      const {out, gasSpent} = comboPool.calcOutByIn(amountIn, true)        
      const ta = out - gasSpent*gasPrice
      const {totalAmountOut} = findMultiRouteExactIn(token0, token1, amountIn, pools, token1, gasPrice)
      expect(totalAmountOut).toBeLessThanOrEqual(ta > 0 ? ta*(1+1e-12):ta*(1-1e-12))
    } 
  })

  it.skip('weak pool with good price', () => {
    const pools = [
      getPool(1e8, 2.05, 0.003),
      getPool(1e19, 2, 0.003),
      getPool(1e18, 2.02, 0.003),
      getPool(1e18, 2, 0.003)
    ]
    const comboPool = new ParallelCPRPool(token0, pools, gasPrice)
    
    for (let i = 0; i < 100; ++i) {
      const amountIn = getRandom(rnd, 1e3, 1e25)
      const {out, gasSpent} = comboPool.calcOutByIn(amountIn, true)        
      const ta = out - gasSpent*gasPrice
      const {totalAmountOut} = findMultiRouteExactIn(token0, token1, amountIn, pools, token1, gasPrice)
      expect(totalAmountOut).toBeLessThanOrEqual(ta > 0 ? ta*(1+1e-12):ta*(1-1e-12))
    } 
  })
})