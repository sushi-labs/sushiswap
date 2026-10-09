import { POST as quote } from 'src/app/(networks)/(evm)/api/cross-chain/value-transfer/quote/route'
import { GET as status } from 'src/app/(networks)/(evm)/api/cross-chain/value-transfer/status/route'
import { POST as submitSignature } from 'src/app/(networks)/(evm)/api/cross-chain/value-transfer/submit-signature/route'
import { GET as getTokens } from 'src/app/(networks)/(evm)/api/cross-chain/value-transfer/tokens/route'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const address = '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098'
const quoteRequest = {
  srcChainKey: 'base',
  dstChainKey: 'arbitrum',
  srcTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  dstTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  srcWalletAddress: address,
  dstWalletAddress: address,
  amount: '10000000',
}
function post(endpoint: string, body: unknown): Request {
  return new Request(
    `http://localhost/api/cross-chain/value-transfer/${endpoint}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
}
const token = {
  chainKey: 'base',
  address: quoteRequest.srcTokenAddress,
  decimals: 6,
  symbol: 'USDC',
  name: 'USD Coin',
  isSupported: true,
}

describe('Value Transfer API routes', () => {
  beforeEach(() =>
    vi.stubEnv('LAYERZERO_VALUE_TRANSFER_API_KEY', 'test-secret'),
  )
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('keeps authenticated requests on the fixed upstream and strips unrecognized options', async () => {
    const options = { feeTolerance: { type: 'PERCENT', amount: 0.5 } }
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        Response.json({ quotes: [], tokens: [], rejectedQuotes: [] }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const result = await quote(
      post('quote', {
        ...quoteRequest,
        apiUrl: 'https://other.example',
        options: { ...options, partnerFee: 500 },
      }),
    )
    expect(result.status).toBe(200)
    expect(result.headers.get('Cache-Control')).toBe('no-store')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://transfer.layerzero-api.com/v1/quotes',
      expect.objectContaining({
        method: 'POST',
        redirect: 'error',
        cache: 'no-store',
        headers: expect.objectContaining({ 'x-api-key': 'test-secret' }),
        body: JSON.stringify({ ...quoteRequest, options }),
      }),
    )
    expect(await result.text()).not.toContain('test-secret')
  })

  it('rejects invalid requests before fetching or using credentials', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect(
      (await quote(post('quote', { ...quoteRequest, amount: '-1' }))).status,
    ).toBe(400)
    expect(
      (
        await status(
          new Request(
            'http://localhost/api/cross-chain/value-transfer/status?quoteId=../tokens',
          ),
        )
      ).status,
    ).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns unavailable when the API key is missing', async () => {
    vi.stubEnv('LAYERZERO_VALUE_TRANSFER_API_KEY', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    expect((await quote(post('quote', quoteRequest))).status).toBe(503)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    { body: '{', status: 400, message: 'Invalid Value Transfer request' },
    {
      body: ' '.repeat(32_769),
      status: 413,
      message: 'Value Transfer request is too large',
    },
  ])(
    'returns an uncached $status for an invalid request body',
    async ({ body, status, message }) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      const result = await quote(
        new Request('http://localhost/api/cross-chain/value-transfer/quote', {
          method: 'POST',
          body,
        }),
      )
      expect(result.status).toBe(status)
      expect(result.headers.get('Cache-Control')).toBe('no-store')
      expect(await result.json()).toEqual({ message })
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it.each([
    Response.json({ quotes: [{ id: 'bad' }], tokens: [] }),
    Response.json({
      error: { message: 'test-secret' },
      quotes: [],
      tokens: [],
    }),
    new Response('test-secret', { status: 500 }),
  ])(
    'fails closed on malformed upstream data without leaking its body',
    async (upstream) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(upstream))
      const result = await quote(post('quote', quoteRequest))
      expect(result.status).toBe(502)
      expect(await result.text()).not.toContain('test-secret')
    },
  )

  it('aggregates public token pagination without sending the API key', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          tokens: [token],
          pagination: { nextToken: 'next-page' },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          tokens: [{ ...token, chainKey: 'arbitrum' }],
          pagination: {},
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const result = await getTokens(
      new Request(
        'http://localhost/api/cross-chain/value-transfer/tokens?transferrableFromChainKey=base',
      ),
    )
    expect((await result.json()).tokens).toHaveLength(2)
    expect(result.headers.get('Cache-Control')).toContain('s-maxage=60')
    expect(fetchMock.mock.calls[1]?.[0]).toContain(
      'pagination%5BnextToken%5D=next-page',
    )
    expect(fetchMock.mock.calls[1]?.[0]).toContain(
      'transferrableFromChainKey=base',
    )
    expect(fetchMock.mock.calls[0]?.[1].headers).not.toHaveProperty('x-api-key')
  })

  it('refuses repeating pagination cursors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          Response.json({
            tokens: [token],
            pagination: { nextToken: 'same' },
          }),
        ),
      ),
    )
    expect(
      (
        await getTokens(
          new Request('http://localhost/api/cross-chain/value-transfer/tokens'),
        )
      ).status,
    ).toBe(502)
  })

  it('distinguishes an unindexed quote from status failures', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(new Response('', { status: 429 }))
    vi.stubGlobal('fetch', fetchMock)
    const request = new Request(
      'http://localhost/api/cross-chain/value-transfer/status?quoteId=0x1234&txHash=0xabcd',
    )
    expect(await (await status(request)).json()).toEqual({ status: 'UNKNOWN' })
    expect((await status(request)).status).toBe(429)
  })

  it('forwards only validated signatures and quote IDs to the signature endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({}))
    vi.stubGlobal('fetch', fetchMock)
    const body = { quoteId: '0x1234', signatures: [`0x${'ab'.repeat(65)}`] }
    expect((await submitSignature(post('submit-signature', body))).status).toBe(
      200,
    )
    expect(fetchMock).toHaveBeenCalledWith(
      'https://transfer.layerzero-api.com/v1/submit-signature',
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }),
    )
  })
})
