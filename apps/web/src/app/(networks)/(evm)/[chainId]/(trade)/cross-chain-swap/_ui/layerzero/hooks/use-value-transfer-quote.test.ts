import {
  valueTransferTestQuote,
  valueTransferTestTrade,
} from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchValueTransferQuote } from './use-value-transfer-quote'
const trade = valueTransferTestTrade()
function params() {
  return {
    token0: trade.token0,
    token1: trade.token1,
    srcToken: {
      ...trade.srcChain.nativeCurrency,
      address: trade.quoteRequest.srcTokenAddress,
    },
    dstToken: {
      ...trade.dstChain.nativeCurrency,
      address: trade.quoteRequest.dstTokenAddress,
    },
    srcChain: trade.srcChain,
    dstChain: trade.dstChain,
    amount: trade.amountIn,
    sourceAddress: trade.sourceAddress,
    recipient: trade.recipient,
    enabled: true,
    slippageBps: 50,
  }
}
afterEach(() => vi.unstubAllGlobals())
describe('Value Transfer quotes', () => {
  it('selects the greatest output only among routes satisfying the user slippage bound', async () => {
    const safe = valueTransferTestQuote()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          quotes: [
            valueTransferTestQuote({
              id: 'unsafe',
              dstAmount: '2000000',
              dstAmountMin: '1980000',
            }),
            safe,
          ],
          tokens: [],
        }),
      ),
    )
    expect((await fetchValueTransferQuote(params()))?.quote.id).toBe('quote-1')
  })
  it('deducts additional native fees from route value and respects fastest ordering', async () => {
    const expensive = valueTransferTestQuote({
      id: 'expensive',
      dstAmount: '2000000',
      dstAmountMin: '1990000',
      dstAmountUsd: '2',
      fees: [
        {
          chainKey: 'ethereum',
          type: 'MESSAGE',
          description: '',
          address: trade.srcChain.nativeCurrency.address,
          amount: '1000000000000000000',
        },
      ],
      duration: { estimated: '1000' },
    })
    const response = {
      quotes: [expensive, valueTransferTestQuote()],
      tokens: [{ ...trade.srcChain.nativeCurrency, price: { usd: 1 } }],
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => Response.json(response)),
    )
    expect((await fetchValueTransferQuote(params()))?.quote.id).toBe('quote-1')
    expect(
      (await fetchValueTransferQuote({ ...params(), order: 'FASTEST' }))?.quote
        .id,
    ).toBe('expensive')
  })
  it('reports when every route has a weaker minimum than the user allowed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          quotes: [valueTransferTestQuote({ dstAmountMin: '1800000' })],
          tokens: [],
        }),
      ),
    )
    await expect(fetchValueTransferQuote(params())).rejects.toThrow(
      'slippage tolerance',
    )
  })
  it('keeps disconnected preview placeholders out of executable account fields', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        Response.json({ quotes: [valueTransferTestQuote()], tokens: [] }),
      )
    vi.stubGlobal('fetch', fetch)
    const result = await fetchValueTransferQuote({
      ...params(),
      sourceAddress: undefined,
      recipient: undefined,
    })
    expect(result?.sourceAddress).toBeUndefined()
    expect(result?.recipient).toBeUndefined()
    const request = JSON.parse(fetch.mock.lastCall?.[1].body)
    expect(request.srcWalletAddress).toMatch(/^0x/)
    expect(request.options.feeTolerance).toEqual({
      type: 'PERCENT',
      amount: 0.5,
    })
  })
  it('does not surface expired quotes or retain an old route when none exists', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          quotes: [valueTransferTestQuote({ expiresAt: '1' })],
          tokens: [],
        }),
      ),
    )
    expect(await fetchValueTransferQuote(params())).toBeNull()
  })
  it('passes cancellation to the request so changed inputs cannot publish a stale result', async () => {
    const signal = new AbortController().signal
    const fetch = vi
      .fn()
      .mockResolvedValue(Response.json({ quotes: [], tokens: [] }))
    vi.stubGlobal('fetch', fetch)
    await fetchValueTransferQuote(params(), signal)
    expect(fetch.mock.lastCall?.[1].signal).toBe(signal)
  })
})
