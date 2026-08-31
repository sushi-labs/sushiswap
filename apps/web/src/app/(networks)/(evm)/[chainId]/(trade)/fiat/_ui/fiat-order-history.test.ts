import type { CrossmintOrder } from 'src/lib/crossmint'
import { describe, expect, it } from 'vitest'
import { getFiatOrderHistoryRow } from './fiat-order-history'

const TRANSACTION_HASH = `0x${'1'.repeat(64)}`

const ORDER = {
  createdAt: '2026-08-31T12:00:00.000Z',
  lineItems: [
    {
      chain: 'base',
      delivery: {
        status: 'delivered',
        tokens: [
          {
            decimals: 6,
            quantity: '1500000',
            symbol: 'USDC',
          },
        ],
        txId: TRANSACTION_HASH,
      },
      metadata: {
        imageUrl: 'https://example.com/usdc.png',
        name: 'USD Coin',
      },
    },
  ],
  orderId: 'b2959ca5-65e4-466a-bd26-1bd05cb4f837',
  payment: {
    method: 'applePay',
    status: 'succeeded',
    totalPaid: {
      amount: '25',
      currency: 'usd',
    },
  },
  phase: 'completed',
} satisfies CrossmintOrder

describe('Crossmint fiat order history rows', () => {
  it('maps order amounts and uses the Sushi chain explorer', () => {
    expect(getFiatOrderHistoryRow(ORDER, 'production')).toEqual({
      explorerUrl: `https://basescan.org/tx/${TRANSACTION_HASH}`,
      fiatAmount: { amount: '25', currency: 'usd' },
      fiatCurrency: 'usd',
      orderId: 'b2959ca5-65e4-466a-bd26-1bd05cb4f837',
      paymentMethod: 'applePay',
      status: 'completed',
      timestamp: '2026-08-31T12:00:00.000Z',
      tokenAmount: '1.5',
      tokenImageUrl: 'https://example.com/usdc.png',
      tokenSymbol: 'USDC',
    })
  })

  it('does not link staging transactions to a mainnet explorer', () => {
    expect(getFiatOrderHistoryRow(ORDER, 'staging').explorerUrl).toBeUndefined()
  })

  it('discards unsafe image URLs and invalid timestamps', () => {
    const row = getFiatOrderHistoryRow(
      {
        ...ORDER,
        createdAt: 'invalid',
        lineItems: [
          {
            ...ORDER.lineItems[0],
            metadata: { imageUrl: 'javascript:alert(1)' },
          },
        ],
      },
      'production',
    )

    expect(row.timestamp).toBeUndefined()
    expect(row.tokenImageUrl).toBeUndefined()
  })
})
