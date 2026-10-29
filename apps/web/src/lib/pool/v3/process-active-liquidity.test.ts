import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { processActiveLiquidity } from './use-concentrated-active-liquidity'

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
