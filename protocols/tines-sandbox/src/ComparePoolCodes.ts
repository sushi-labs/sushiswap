import { PoolCode } from '@sushiswap/router'
import { UniV3Pool } from '@sushiswap/tines'
import { expect } from 'chai'

export function comparePoolCodes(pc1: PoolCode, pc2: PoolCode): boolean {
  const p1 = pc1.pool
  const p2 = pc2.pool
  expect(p1.address).equal(p2.address)
  expect(p1.token0.address).equal(p2.token0.address)
  expect(p1.token1.address).equal(p2.token1.address)
  expect(p1.fee).equal(p2.fee)
  expect(p1.minLiquidity).equal(p2.minLiquidity)
  expect(p1.swapGasCost).equal(p2.swapGasCost)
  expect(p1.reserve0.toString()).equal(p2.reserve0.toString())
  expect(p1.reserve1.toString()).equal(p2.reserve1.toString())
  if (p1 instanceof UniV3Pool) {
    expect(p2 instanceof UniV3Pool).equal(true)
    const pp2 = p2 as UniV3Pool
    expect(p1.liquidity.toString()).equal(pp2.liquidity.toString())
    expect(p1.sqrtPriceX96.toString()).equal(pp2.sqrtPriceX96.toString())
    expect(p1.ticks.length).equal(pp2.ticks.length)
    p1.ticks.forEach((t1, i) => {
      const t2 = pp2.ticks[i]
      expect(t1.index).equal(t2.index, `tick ${i}/${p1.ticks.length}`)
      expect(t1.DLiquidity.toString()).equal(
        t2.DLiquidity.toString(),
        `tick ${i}/${p1.ticks.length}`,
      )
    })
    expect(p1.nearestTick).equal(pp2.nearestTick)
  }
  return true
}

export function isSubpool(etalon: PoolCode, result: PoolCode): boolean {
  const p1 = etalon.pool
  const p2 = result.pool
  expect(p1.address).equal(p2.address)
  expect(p1.token0.address).equal(p2.token0.address)
  expect(p1.token1.address).equal(p2.token1.address)
  expect(p1.fee).equal(p2.fee)
  expect(p1.minLiquidity).equal(p2.minLiquidity)
  expect(p1.swapGasCost).equal(p2.swapGasCost)
  // expect(p1.reserve0.gte(p2.reserve0)).equal(true)
  // expect(p1.reserve1.gte(p2.reserve1)).equal(true, `${p1.reserve1.toString()} >= ${p2.reserve1.toString()}`)
  if (p1 instanceof UniV3Pool) {
    expect(p2 instanceof UniV3Pool).equal(true)
    const pp2 = p2 as UniV3Pool
    expect(p1.liquidity.toString()).equal(pp2.liquidity.toString())
    expect(p1.sqrtPriceX96.toString()).equal(pp2.sqrtPriceX96.toString())
    expect(p1.ticks.length).lessThanOrEqual(pp2.ticks.length)
    const start = pp2.ticks.findIndex((t) => t.index == p1.ticks[0].index)
    expect(start).not.equal(-1)
    p1.ticks.forEach((t1, i) => {
      const t2 = pp2.ticks[start + i]
      expect(t1.index).equal(t2.index, `tick ${i}/${p1.ticks.length}`)
      expect(t1.DLiquidity.toString()).equal(
        t2.DLiquidity.toString(),
        `tick ${i}/${p1.ticks.length}`,
      )
    })
    expect(p1.nearestTick + start).equal(pp2.nearestTick)
  }
  return true
}
