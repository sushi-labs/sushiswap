import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchCrossmintOrdersPage } from './crossmint-orders'

const RECIPIENT_ADDRESS = '0x0000000000000000000000000000000000000001'

describe('Crossmint orders', () => {
  beforeEach(() => {
    vi.stubEnv('CROSSMINT_SERVER_SIDE_API_KEY', 'sk_staging_example')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('requests a page filtered by recipient address', async () => {
    const fetchMock = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          JSON.stringify({
            data: [
              {
                createdAt: '2026-08-31T12:00:00.000Z',
                orderId: 'order-id',
                payment: {
                  preparation: { sessionToken: 'do-not-return' },
                  status: 'requires-kyc',
                  totalPaid: { amount: '25', currency: 'usd' },
                },
                phase: 'payment',
              },
            ],
            nextCursor: 'next-page',
            previousCursor: null,
          }),
          { status: 200 },
        ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchCrossmintOrdersPage({
        cursor: 'current-page',
        limit: 20,
        recipientAddress: [RECIPIENT_ADDRESS, RECIPIENT_ADDRESS],
      }),
    ).resolves.toEqual({
      data: [
        {
          createdAt: '2026-08-31T12:00:00.000Z',
          orderId: 'order-id',
          payment: {
            status: 'requires-kyc',
            totalPaid: { amount: '25', currency: 'usd' },
          },
          phase: 'payment',
        },
      ],
      environment: 'staging',
      nextCursor: 'next-page',
      previousCursor: undefined,
    })

    const [input, init] = fetchMock.mock.calls[0]
    const url = new URL(String(input))

    expect(url.origin).toBe('https://staging.crossmint.com')
    expect(url.pathname).toBe('/api/2022-06-09/orders')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      cursor: 'current-page',
      deliveryStatus: 'in-progress,partial-delivery,delivered,failed',
      limit: '20',
      paymentStatus: 'in-progress,succeeded,declined,refunded',
      recipientAddress: RECIPIENT_ADDRESS,
      sort: 'desc',
    })
    expect(init?.headers).toMatchObject({
      'X-API-KEY': 'sk_staging_example',
    })
  })

  it('rejects requests without a recipient address', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      fetchCrossmintOrdersPage({ recipientAddress: [] }),
    ).rejects.toThrow()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects malformed API responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ data: [{ phase: 'payment' }] }), {
            status: 200,
          }),
      ),
    )

    await expect(
      fetchCrossmintOrdersPage({ recipientAddress: [RECIPIENT_ADDRESS] }),
    ).rejects.toThrow()
  })
})
