import { OrderStatus } from '@cowprotocol/cow-sdk'
import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import { getRemainingSellAmount } from './amounts'
import { COW_LIMIT_CHAIN_IDS, isCowLimitChainId } from './chains'
import {
  assertEditableCowOrder,
  getCowSettlement,
  isSushiCowOrder,
} from './order'
import { getCowTypedData } from './signing'
import { historyOrder, owner, preparedOrder, token1 } from './test-fixtures'

describe('CoW payloads and attribution', () => {
  it.each(COW_LIMIT_CHAIN_IDS)(
    'uses canonical signing and Sushi metadata on chain %i',
    async (chainId) => {
      const prepared = await preparedOrder(chainId)
      const typedData = await getCowTypedData(prepared)
      expect(typedData.domain.chainId).toBe(chainId)
      expect(typedData.domain.verifyingContract).toBe(getCowSettlement(chainId))
      expect(prepared.order).toMatchObject({
        partiallyFillable: true,
        receiver: owner.address,
        feeAmount: '0',
        kind: 'sell',
      })
      const metadata = JSON.parse(prepared.fullAppData)
      expect(metadata).toMatchObject({
        appCode: 'Sushi',
        metadata: { orderClass: { orderClass: 'limit' } },
      })
      expect(metadata.metadata.partnerFee).toBeUndefined()
      expect(await owner.signTypedData(typedData)).toMatch(/^0x[0-9a-f]{130}$/)
    },
  )
  it('does not include Ink or legacy-only Katana in new order networks', () => {
    expect(COW_LIMIT_CHAIN_IDS).toHaveLength(9)
    expect(isCowLimitChainId(57073)).toBe(false)
    expect(isCowLimitChainId(EvmChainId.KATANA)).toBe(false)
  })
  it('only shows orders with Sushi limit metadata', async () => {
    const order = await historyOrder()
    expect(isSushiCowOrder(order)).toBe(true)
    expect(isSushiCowOrder({ ...order, fullAppData: '{}' })).toBe(false)
    expect(isSushiCowOrder({ ...order, fullAppData: 'not json' })).toBe(false)
    expect(isSushiCowOrder({ ...order, fullAppData: undefined })).toBe(false)
    expect(
      isSushiCowOrder({
        ...order,
        fullAppData: order.fullAppData?.replace('Sushi', 'Another app'),
      }),
    ).toBe(false)
  })
  it('only edits open, partially filled orders that pay their owner', async () => {
    const order = await historyOrder()
    expect(getRemainingSellAmount(order)).toBe(750000n)
    expect(assertEditableCowOrder(order)).toBe(order)
    expect(() => assertEditableCowOrder(undefined)).toThrow(
      'no longer be edited',
    )
    expect(() =>
      assertEditableCowOrder({ ...order, status: OrderStatus.CANCELLED }),
    ).toThrow('no longer be edited')
    expect(() =>
      assertEditableCowOrder({ ...order, receiver: token1 }),
    ).toThrow('different recipient')
    expect(() =>
      assertEditableCowOrder({
        ...order,
        executedSellAmountBeforeFees: order.sellAmount,
      }),
    ).toThrow('filled completely')
  })
})
