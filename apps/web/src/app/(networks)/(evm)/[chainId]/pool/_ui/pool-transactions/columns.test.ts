import { EvmChainId, EvmToken } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getSwapLegs } from './columns'
import { type PoolTransaction, PoolTransactionType } from './types'

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

function swap(amount0: number, amount1: number): PoolTransaction {
  return {
    type: PoolTransactionType.Swap,
    origin: null,
    amount0,
    amount1,
    amountUSD: 0,
    timestamp: 0,
    logIndex: 0,
    pool: { chainId: EvmChainId.ETHEREUM, token0, token1 },
    transaction: { id: '0x' },
  }
}

describe('getSwapLegs', () => {
  it('puts the token that entered the pool first', () => {
    expect(getSwapLegs(swap(1, -2))).toEqual({
      amounts: [1, -2],
      tokens: [token0, token1],
    })
    expect(getSwapLegs(swap(-1, 2))).toEqual({
      amounts: [2, -1],
      tokens: [token1, token0],
    })
  })
})
