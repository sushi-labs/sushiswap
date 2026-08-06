import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import computeSurroundingTicks from './functions'

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

describe('computeSurroundingTicks', () => {
  it('includes the lower pivot when the active tick is not initialized', () => {
    const result = computeSurroundingTicks(
      token0,
      token1,
      {
        tick: 120,
        liquidityActive: 100n,
        liquidityNet: 0n,
        price0: '1',
      },
      [
        { tickIdx: -100, liquidityNet: 50n },
        { tickIdx: 100, liquidityNet: -50n },
        { tickIdx: 200, liquidityNet: -100n },
      ],
      1,
      false,
    )

    expect(
      result.map(({ tick, liquidityActive }) => ({ tick, liquidityActive })),
    ).toEqual([
      { tick: -100, liquidityActive: 150n },
      { tick: 100, liquidityActive: 100n },
    ])
  })

  it('does not duplicate the pivot when it is the active tick', () => {
    const result = computeSurroundingTicks(
      token0,
      token1,
      {
        tick: 100,
        liquidityActive: 100n,
        liquidityNet: -50n,
        price0: '1',
      },
      [
        { tickIdx: -100, liquidityNet: 50n },
        { tickIdx: 100, liquidityNet: -50n },
        { tickIdx: 200, liquidityNet: -50n },
      ],
      1,
      false,
    )

    expect(result.map(({ tick }) => tick)).toEqual([-100])
  })
})
