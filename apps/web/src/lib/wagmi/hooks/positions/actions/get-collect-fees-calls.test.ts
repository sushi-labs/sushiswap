import { Amount } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  EvmToken,
  SUSHISWAP_V3_POSITION_MANAGER,
  nonfungiblePositionManagerAbi_collect,
  nonfungiblePositionManagerAbi_multicall,
} from 'sushi/evm'
import { type Hex, decodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import { ARC_V1_POSITION_MANAGER } from '../arc-position-manager-refund'
import { getCollectFeesCalls } from './get-collect-fees-calls'

const chainId = EvmChainId.ARC
const currentManager = SUSHISWAP_V3_POSITION_MANAGER[chainId]
const token = new EvmToken({
  chainId,
  address: '0x0000000000000000000000000000000000000002',
  decimals: 6,
  symbol: 'TEST',
  name: 'Test',
})

function position(positionManager: EvmAddress, tokenId: bigint) {
  return {
    positionManager,
    tokenId,
    expectedCurrencyOwed0: new Amount(token, 10n),
    expectedCurrencyOwed1: new Amount(token, 20n),
    recipient: '0x0000000000000000000000000000000000000001',
  }
}

function collectedTokenIds(data: Hex): bigint[] {
  const decoded = decodeFunctionData({
    abi: [
      ...nonfungiblePositionManagerAbi_collect,
      ...nonfungiblePositionManagerAbi_multicall,
    ],
    data,
  })
  return decoded.functionName === 'collect'
    ? [decoded.args[0].tokenId]
    : decoded.args[0].flatMap(collectedTokenIds)
}

describe('getCollectFeesCalls', () => {
  it('keeps overlapping token IDs on different managers in separate transactions', () => {
    const calls = getCollectFeesCalls({
      chainId,
      positions: [
        position(currentManager, 1n),
        position(ARC_V1_POSITION_MANAGER, 1n),
        position(currentManager, 2n),
      ],
    })

    expect(calls.map(({ to }) => to)).toEqual([
      currentManager,
      ARC_V1_POSITION_MANAGER,
    ])
    expect(calls.map(({ data }) => collectedTokenIds(data))).toEqual([
      [1n, 2n],
      [1n],
    ])
    expect(
      calls.every((call) => call.chainId === chainId && call.value === 0n),
    ).toBe(true)
  })

  it('groups the same manager regardless of address casing', () => {
    const calls = getCollectFeesCalls({
      chainId,
      positions: [
        position(ARC_V1_POSITION_MANAGER, 1n),
        position('0xf27f32580a399bdb55b6e1f025b8985c97e2a9d5', 2n),
      ],
    })
    expect(calls).toHaveLength(1)
    expect(collectedTokenIds(calls[0].data)).toEqual([1n, 2n])
  })

  it('returns no transactions when there are no fees to collect', () => {
    expect(getCollectFeesCalls({ chainId, positions: [] })).toEqual([])
  })

  it('rejects an unsupported destination before encoding transactions', () => {
    expect(() =>
      getCollectFeesCalls({
        chainId,
        positions: [position('0x0000000000000000000000000000000000000003', 1n)],
      }),
    ).toThrow('Unsupported position manager')
  })
})
