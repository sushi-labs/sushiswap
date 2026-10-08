import { describe, expect, it } from 'vitest'
import { normalizeValueTransferTrade } from './trade'
import { valueTransferTestTrade } from './trade-test-fixtures'

describe('Value Transfer quote normalization', () => {
  it('keeps token protocol fees separate from native messaging fees without a synthetic buffer', () => {
    const trade = valueTransferTestTrade()
    expect(trade.nativeFee).toBe(1000n)
    expect(trade.maxNativeFee).toBe(1000n)
    expect(trade.protocolFee).toBe(100000n)
    expect(trade.estimatedSeconds).toBe(120)
  })
  it('does not derive protocol fees from differently denominated output tokens', () => {
    const trade = valueTransferTestTrade()
    expect(
      normalizeValueTransferTrade({
        ...trade,
        quote: { ...trade.quote, dstAmount: '100000000000000000000', fees: [] },
      }).protocolFee,
    ).toBe(0n)
  })
  it('rejects a quote for a changed input amount or chain', () => {
    const trade = valueTransferTestTrade()
    expect(() =>
      normalizeValueTransferTrade({
        ...trade,
        quote: { ...trade.quote, srcAmount: '1' },
      }),
    ).toThrow('amounts')
    expect(() =>
      normalizeValueTransferTrade({
        ...trade,
        quoteRequest: { ...trade.quoteRequest, srcChainKey: 'base' },
      }),
    ).toThrow('networks')
  })
  it('rejects an invalid minimum and does not invent an arrival time', () => {
    const trade = valueTransferTestTrade()
    expect(() =>
      normalizeValueTransferTrade({
        ...trade,
        quote: { ...trade.quote, dstAmountMin: '2000001' },
      }),
    ).toThrow('amounts')
    expect(
      normalizeValueTransferTrade({
        ...trade,
        quote: { ...trade.quote, duration: { estimated: null } },
      }).estimatedSeconds,
    ).toBeUndefined()
  })
})
