import { TokenResponse } from '@defuse-protocol/one-click-sdk-typescript'
import type {
  GetExecutionStatusResponse,
  QuoteResponse,
} from '@defuse-protocol/one-click-sdk-typescript'
import { getNearIntentsFeeRecipient } from 'src/lib/swap/near-intents/placeholders'
import { createNearIntentsErrorResponse } from 'src/lib/swap/near-intents/sdk'
import { describe, expect, it } from 'vitest'
import { ZodError } from 'zod'
import {
  buildNearIntentsSdkQuoteRequest,
  nearIntentsQuoteRequestSchema,
  normalizeNearIntentsExecutionResponse,
  normalizeNearIntentsQuoteResponse,
  normalizeNearIntentsTokens,
} from './schemas'

describe('near-intents route schemas', () => {
  it('builds dry quote payloads with placeholders and fixed app fees', () => {
    const request = nearIntentsQuoteRequestSchema.parse({
      dry: true,
      fromChainId: 1,
      toChainId: -4,
      originAsset: 'eth:native',
      destinationAsset: 'stellar:XLM',
      amount: '1000000000000000000',
      slippageBps: 100,
    })

    expect(buildNearIntentsSdkQuoteRequest(request)).toMatchObject({
      dry: true,
      depositMode: 'SIMPLE',
      swapType: 'EXACT_INPUT',
      depositType: 'ORIGIN_CHAIN',
      recipientType: 'DESTINATION_CHAIN',
      refundType: 'ORIGIN_CHAIN',
      recipient: 'GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV',
      refundTo: getNearIntentsFeeRecipient({ fromChainId: 1, toChainId: -4 }),
      appFees: [
        {
          recipient: getNearIntentsFeeRecipient({
            fromChainId: 1,
            toChainId: -4,
          }),
          fee: 35,
        },
      ],
      quoteWaitingTimeMs: 3000,
    })
  })

  it('requires real recipient and refund addresses for executable quotes', () => {
    expect(() =>
      nearIntentsQuoteRequestSchema.parse({
        dry: false,
        fromChainId: -4,
        toChainId: 1,
        originAsset: 'stellar:XLM',
        destinationAsset: 'eth:native',
        amount: '10000000',
        slippageBps: 100,
      }),
    ).toThrow('recipient and refundTo are required for executable quotes')
  })

  it('normalizes SDK token lists and keeps the widened stellar blockchain value', async () => {
    expect(
      await normalizeNearIntentsTokens([
        {
          assetId: 'eth:native',
          decimals: 18,
          blockchain: TokenResponse.blockchain.ETH,
          symbol: 'ETH',
          price: 2000,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
        },
        {
          assetId: 'stellar:XLM',
          decimals: 7,
          blockchain: 'stellar',
          symbol: 'XLM',
          price: 0.1,
          priceUpdatedAt: '2024-01-01T00:00:00Z',
        },
      ]),
    ).toEqual({
      tokens: [
        {
          assetId: 'eth:native',
          chainId: 1,
          blockchain: 'eth',
          symbol: 'ETH',
          name: 'ETH',
          decimals: 18,
          priceUSD: '2000',
          priceUpdatedAt: '2024-01-01T00:00:00Z',
          kind: 'native',
        },
        {
          assetId: 'stellar:XLM',
          chainId: -4,
          blockchain: 'stellar',
          symbol: 'XLM',
          name: 'XLM',
          decimals: 7,
          priceUSD: '0.1',
          priceUpdatedAt: '2024-01-01T00:00:00Z',
          logoURI:
            'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
          kind: 'stellar-native',
        },
      ],
    })
  })

  it('normalizes execution status payloads into the route response shape', () => {
    expect(
      normalizeNearIntentsExecutionResponse({
        correlationId: 'corr-1',
        quoteResponse: {
          correlationId: 'quote-corr',
          timestamp: '2024-01-01T00:00:00Z',
          signature: 'sig',
          quoteRequest: {
            dry: false,
            swapType:
              'EXACT_INPUT' as QuoteResponse['quoteRequest']['swapType'],
            slippageTolerance: 100,
            originAsset: 'eth:native',
            depositType:
              'ORIGIN_CHAIN' as QuoteResponse['quoteRequest']['depositType'],
            destinationAsset: 'stellar:XLM',
            amount: '1000',
            refundTo: '0xabc',
            refundType:
              'ORIGIN_CHAIN' as QuoteResponse['quoteRequest']['refundType'],
            recipient: 'GABC',
            recipientType:
              'DESTINATION_CHAIN' as QuoteResponse['quoteRequest']['recipientType'],
            deadline: '2024-01-01T00:15:00Z',
          },
          quote: {
            amountIn: '1000',
            amountInFormatted: '0.000000000000001',
            amountInUsd: '2',
            minAmountIn: '1000',
            amountOut: '10',
            amountOutFormatted: '1',
            amountOutUsd: '1',
            minAmountOut: '9',
            timeEstimate: 120,
          },
        },
        status: 'PROCESSING' as GetExecutionStatusResponse['status'],
        updatedAt: '2024-01-01T00:01:00Z',
        swapDetails: {
          intentHashes: [],
          nearTxHashes: ['near-hash'],
          originChainTxHashes: [
            {
              hash: 'origin-hash',
              explorerUrl: 'https://origin.example',
            },
          ],
          destinationChainTxHashes: [
            {
              hash: 'destination-hash',
              explorerUrl: 'https://destination.example',
            },
          ],
          amountIn: '1000',
          amountOut: '10',
          amountInUsd: '2',
          amountOutUsd: '1',
          refundReason: 'NONE',
        },
      } as unknown as GetExecutionStatusResponse),
    ).toEqual({
      status: 'PROCESSING',
      destinationTxHashes: [
        {
          hash: 'destination-hash',
        },
      ],
    })
  })

  it('ignores unused deposit-submit fields that can be null or empty', () => {
    expect(
      normalizeNearIntentsExecutionResponse({
        correlationId: 'corr-1',
        quoteResponse: {
          correlationId: 'quote-corr',
          timestamp: '2024-01-01T00:00:00Z',
          signature: 'sig',
          quoteRequest: {
            dry: false,
            swapType:
              'EXACT_INPUT' as QuoteResponse['quoteRequest']['swapType'],
            slippageTolerance: 50,
            originAsset: 'stellar:XLM',
            depositType:
              'ORIGIN_CHAIN' as QuoteResponse['quoteRequest']['depositType'],
            destinationAsset: 'eth:native',
            amount: '50000000',
            refundTo: 'GABC',
            refundType:
              'ORIGIN_CHAIN' as QuoteResponse['quoteRequest']['refundType'],
            recipient: '0xabc',
            recipientType:
              'DESTINATION_CHAIN' as QuoteResponse['quoteRequest']['recipientType'],
            deadline: '2024-01-01T00:15:00Z',
          },
          quote: {
            amountIn: '50000000',
            amountInFormatted: '5.0',
            amountInUsd: '0.7179',
            minAmountIn: '50000000',
            amountOut: '338020381749843',
            amountOutFormatted: '0.000338020381749843',
            amountOutUsd: '0.7140',
            minAmountOut: '336227256653982',
            timeEstimate: 24,
          },
        },
        status: 'SUCCESS' as GetExecutionStatusResponse['status'],
        updatedAt: '2026-05-21T12:36:08.000Z',
        swapDetails: {
          intentHashes: ['intent-hash'],
          nearTxHashes: ['near-hash'],
          originChainTxHashes: [
            {
              hash: 'origin-hash',
              explorerUrl: '',
            },
          ],
          destinationChainTxHashes: [
            {
              hash: 'destination-hash',
              explorerUrl: '',
            },
          ],
          amountIn: null,
          amountOut: null,
          amountInUsd: null,
          amountOutUsd: null,
          refundReason: null,
        },
      } as unknown as GetExecutionStatusResponse),
    ).toEqual({
      status: 'SUCCESS',
      destinationTxHashes: [{ hash: 'destination-hash' }],
    })
  })

  it('validates executable quote deposit addresses', () => {
    const quoteResponse = {
      correlationId: 'quote-corr',
      timestamp: '2024-01-01T00:00:00Z',
      signature: 'sig',
      quote: {
        amountIn: '1000',
        amountInFormatted: '0.000000000000001',
        amountInUsd: '2',
        minAmountIn: '1000',
        amountOut: '10',
        amountOutFormatted: '1',
        amountOutUsd: '1',
        minAmountOut: '9',
        timeEstimate: 120,
      },
    }

    expect(
      normalizeNearIntentsQuoteResponse({
        ...quoteResponse,
        quote: {
          ...quoteResponse.quote,
          depositAddress: '0x0000000000000000000000000000000000000001',
        },
      }).quote.depositAddress,
    ).toBe('0x0000000000000000000000000000000000000001')

    expect(
      normalizeNearIntentsQuoteResponse({
        ...quoteResponse,
        quote: {
          ...quoteResponse.quote,
          depositAddress:
            'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        },
      }).quote.depositAddress,
    ).toBe('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')

    expect(() =>
      normalizeNearIntentsQuoteResponse({
        ...quoteResponse,
        quote: {
          ...quoteResponse.quote,
          depositAddress: 'not-an-address',
        },
      }),
    ).toThrow('depositAddress must be a valid EVM or Stellar account address')
  })

  it('rejects malformed SDK quote payloads with a route validation error', () => {
    expect(() => normalizeNearIntentsQuoteResponse(undefined)).toThrow(
      'Invalid NEAR Intents quote response',
    )
  })

  it('maps zod validation errors to 400 responses', async () => {
    const response = createNearIntentsErrorResponse(
      new ZodError([
        {
          code: 'custom',
          message: 'bad input',
          path: ['amount'],
        },
      ]),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ message: 'bad input' })
  })
})
