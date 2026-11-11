import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { processActiveLiquidity } from './active-liquidity'

const token0 = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'TOKEN0',
  name: 'Token 0',
})
const token1 = new EvmToken({
  chainId: EvmChainId.ETHEREUM,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 18,
  symbol: 'TOKEN1',
  name: 'Token 1',
})

// One position spanning [-120, 120]
const ticks = [
  { tickIdx: -120, liquidityNet: 100n },
  { tickIdx: 120, liquidityNet: -100n },
]

function getLiquidityByTick(activeTick: number) {
  return processActiveLiquidity({
    token0,
    token1,
    activeTick,
    liquidity: 0n,
    ticks,
  })?.map(({ tick, liquidityActive }) => [tick, liquidityActive])
}

describe('processActiveLiquidity', () => {
  it('keeps the liquidity when the active tick is above every tick', () => {
    expect(getLiquidityByTick(180)).toEqual([
      [-120, 100n],
      [120, 0n],
      [180, 0n],
    ])
  })

  it('keeps the liquidity when the active tick is below every tick', () => {
    expect(getLiquidityByTick(-180)).toEqual([
      [-180, 0n],
      [-120, 100n],
      [120, 0n],
    ])
  })
})

it('keeps prices far below one distinct', () => {
  // About 1.4e-11 to 3.8e-11, which 8 fixed digits round to zero
  const prices = processActiveLiquidity({
    token0,
    token1,
    activeTick: -250000,
    liquidity: 10n,
    ticks: [
      { tickIdx: -260000, liquidityNet: 10n },
      { tickIdx: -240000, liquidityNet: -10n },
    ],
  })?.map(({ price0 }) => Number(price0))

  expect(prices).toHaveLength(3)
  expect(prices?.[0]).toBeCloseTo(1.0001 ** -260000, 18)
  expect(prices?.[0]).toBeGreaterThan(0)
  expect(prices?.[0]).toBeLessThan(prices![1]!)
  expect(prices?.[1]).toBeLessThan(prices![2]!)
})
