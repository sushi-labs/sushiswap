import type { PublicClient } from 'viem'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  assertLayerZeroQuoteIsSafe,
  fetchLayerZeroQuote,
  normalizeLayerZeroAmount,
  scaleLayerZeroAmount,
} from './quote'
import { quoteStellarMessagingFee, quoteStellarOft } from './stellar'
import type { LayerZeroQuote } from './types'

vi.mock('./stellar', () => ({
  encodeStellarLayerZeroRecipient: () => `0x${'11'.repeat(32)}`,
  quoteStellarOft: vi.fn(),
  quoteStellarMessagingFee: vi.fn(),
}))

const stellarAccount =
  'GATISXX6BZ6NC7IKQBY37CJD4SOZL3CYZJWXEDG6JVIY4WBS6KXJHN6Q'
const evmAccount = '0x000000000000000000000000000000000000dEaD'
const readContract = vi.fn()
const publicClient = { readContract } as unknown as Pick<
  PublicClient,
  'readContract'
>

beforeEach(() => {
  vi.resetAllMocks()
  readContract.mockImplementation(
    async ({ functionName }: { functionName: string }) => {
      if (functionName === 'quoteOFT')
        return [
          { minAmountLD: 0n, maxAmountLD: 100_000_000n },
          [],
          { amountSentLD: 1_000_000n, amountReceivedLD: 1_000_000n },
        ]
      return { nativeFee: 100n, lzTokenFee: 0n }
    },
  )
  vi.mocked(quoteStellarOft).mockResolvedValue({
    minAmount: 0n,
    maxAmount: 100_000_000n,
    amountSent: 10_000_000n,
    amountReceived: 10_000_000n,
  })
  vi.mocked(quoteStellarMessagingFee).mockResolvedValue(100n)
})

function evmQuote(): Promise<LayerZeroQuote> {
  return fetchLayerZeroQuote({
    fromChainId: 1,
    toChainId: -4,
    amount: 1_000_000n,
    slippageBps: 50,
    sourceAddress: evmAccount,
    recipient: stellarAccount,
    publicClient,
  })
}

describe('LayerZero quote precision', () => {
  it('scales raw units without floating point conversions', () => {
    expect(scaleLayerZeroAmount(123456789012345678n, 7, 6)).toBe(
      12345678901234567n,
    )
    expect(scaleLayerZeroAmount(1234567n, 6, 7)).toBe(12345670n)
    expect(normalizeLayerZeroAmount(10000009n, 7)).toBe(10000000n)
  })

  it('converts EVM USDT into Stellar 7-decimal output units', async () => {
    const quote = await evmQuote()
    expect(quote.amountOut).toBe(10_000_000n)
    expect(quote.minAmountOut).toBe(9_950_000n)
    expect(quote.sendParam.dstEid).toBe(30600)
    expect(quote.sendParam.minAmountLD).toBe(995_000n)
    expect(quote.maxNativeFee).toBe(110n)
    expect(quote.sendParam.composeMsg).toBe('0x')
  })

  it('leaves Stellar dust in the source wallet and converts output to EVM units', async () => {
    const quote = await fetchLayerZeroQuote({
      fromChainId: -4,
      toChainId: 1,
      amount: 10_000_009n,
      slippageBps: 50,
      sourceAddress: stellarAccount,
      recipient: evmAccount,
    })
    expect(quote.amountIn).toBe(10_000_009n)
    expect(quote.sendParam.amountLD).toBe(10_000_000n)
    expect(quote.amountSent).toBe(10_000_000n)
    expect(quote.amountOut).toBe(1_000_000n)
    expect(quote.minAmountOut).toBe(995_000n)
    expect(quote.sendParam.to).toHaveLength(66)
  })

  it('rejects below-precision amounts, invalid recipients and unsupported pairs', async () => {
    await expect(
      fetchLayerZeroQuote({
        fromChainId: -4,
        toChainId: 1,
        amount: 9n,
        slippageBps: 50,
      }),
    ).rejects.toThrow('Minimum transfer')
    await expect(
      fetchLayerZeroQuote({
        fromChainId: 1,
        toChainId: 42161,
        amount: 1_000_000n,
        slippageBps: 50,
        publicClient,
      }),
    ).rejects.toThrow('Unsupported')
    await expect(
      fetchLayerZeroQuote({
        fromChainId: 1,
        toChainId: -4,
        amount: 1_000_000n,
        slippageBps: 50,
        recipient: evmAccount,
        publicClient,
      }),
    ).rejects.toThrow('Invalid destination')
  })

  it('rejects transfer limits and unexpected fee tokens', async () => {
    readContract.mockResolvedValueOnce([
      { minAmountLD: 2_000_000n, maxAmountLD: 10_000_000n },
      [],
      { amountSentLD: 1_000_000n, amountReceivedLD: 1_000_000n },
    ])
    await expect(evmQuote()).rejects.toThrow('transfer limits')
    readContract
      .mockResolvedValueOnce([
        { minAmountLD: 0n, maxAmountLD: 10_000_000n },
        [],
        { amountSentLD: 1_000_000n, amountReceivedLD: 1_000_000n },
      ])
      .mockResolvedValueOnce({ nativeFee: 100n, lzTokenFee: 1n })
    await expect(evmQuote()).rejects.toThrow('Unsupported LayerZero token fee')
  })
})

describe('LayerZero execution bounds', () => {
  it('rejects changed amounts, wallets, routes, output and excessive fees', async () => {
    const reviewed = await evmQuote()
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, { ...reviewed, nativeFee: 110n }),
    ).not.toThrow()
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, { ...reviewed, nativeFee: 111n }),
    ).toThrow('fee increased')
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, {
        ...reviewed,
        amountOut: reviewed.minAmountOut - 1n,
      }),
    ).toThrow('received amount changed')
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, {
        ...reviewed,
        amountIn: 2_000_000n,
      }),
    ).toThrow('inputs changed')
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, {
        ...reviewed,
        recipient: undefined,
      }),
    ).toThrow('inputs changed')
    expect(() =>
      assertLayerZeroQuoteIsSafe(reviewed, { ...reviewed, fromChainId: 42161 }),
    ).toThrow('inputs changed')
  })
})
