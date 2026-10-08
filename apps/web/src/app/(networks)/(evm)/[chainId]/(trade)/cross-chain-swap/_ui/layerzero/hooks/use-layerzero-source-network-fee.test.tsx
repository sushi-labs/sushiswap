import { valueTransferTestTrade } from 'src/lib/swap/value-transfer/trade-test-fixtures'
import { http, createPublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { estimateValueTransferSourceNetworkFee } from './use-layerzero-source-network-fee'

const { buildStellar } = vi.hoisted(() => ({ buildStellar: vi.fn() }))
vi.mock('src/lib/swap/value-transfer/execution', () => ({
  buildValueTransferStellarTransaction: buildStellar,
  validateValueTransferSolanaTransaction: vi.fn(),
}))
const trade = valueTransferTestTrade()
const publicClient = createPublicClient({ chain: mainnet, transport: http() })
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Value Transfer source gas estimate', () => {
  it('does not estimate a disconnected preview', async () => {
    expect(
      await estimateValueTransferSourceNetworkFee({
        ...trade,
        sourceAddress: undefined,
      }),
    ).toEqual({ status: 'connect-wallet' })
  })
  it('estimates returned EVM transaction gas separately from native bridge fees', async () => {
    const estimateGas = vi
      .spyOn(publicClient, 'estimateGas')
      .mockResolvedValue(100_000n)
    vi.spyOn(publicClient, 'getGasPrice').mockResolvedValue(20n)
    const result = await estimateValueTransferSourceNetworkFee(
      {
        ...trade,
        quote: {
          ...trade.quote,
          userSteps: [
            {
              type: 'TRANSACTION',
              chainType: 'EVM',
              description: 'bridge',
              chainKey: 'ethereum',
              signerAddress: '0x000000000000000000000000000000000000dEaD',
              transaction: {
                encoded: {
                  chainId: 1,
                  to: '0x0000000000000000000000000000000000000001',
                  data: '0x',
                  value: '1000',
                },
              },
            },
          ],
        },
      },
      publicClient,
    )
    expect(result).toEqual({ status: 'estimated', amount: 2_000_000n })
    expect(estimateGas.mock.lastCall?.[0].value).toBe(1000n)
  })
  it('keeps approval-dependent gas unavailable rather than inventing a number', async () => {
    expect(
      await estimateValueTransferSourceNetworkFee(
        {
          ...trade,
          quote: {
            ...trade.quote,
            userSteps: [
              {
                type: 'TRANSACTION',
                chainType: 'EVM',
                description: 'approve',
                chainKey: 'ethereum',
                signerAddress: '0x000000000000000000000000000000000000dEaD',
                transaction: {
                  encoded: {
                    chainId: 1,
                    to: '0x0000000000000000000000000000000000000001',
                    data: '0x',
                  },
                },
              },
            ],
          },
        },
        publicClient,
      ),
    ).toEqual({ status: 'approval-required' })
  })
  it('builds fresh user steps when the quote omits them', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        userSteps: [
          {
            type: 'SIGNATURE',
            description: 'bridge',
            chainKey: 'ethereum',
            signerAddress: '0x000000000000000000000000000000000000dEaD',
            signature: {
              type: 'EIP712',
              typedData: {
                primaryType: 'Order',
                domain: {
                  verifyingContract:
                    '0x0000000000000000000000000000000000000001',
                },
                types: {},
                message: {},
              },
            },
          },
        ],
      }),
    )
    vi.stubGlobal('fetch', fetch)
    expect(await estimateValueTransferSourceNetworkFee(trade)).toEqual({
      status: 'estimated',
      amount: 0n,
    })
    expect(JSON.parse(fetch.mock.lastCall?.[1].body)).toEqual({
      quoteId: 'quote-1',
    })
  })
})
