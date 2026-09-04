import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

describe('LayerZero arrival estimate API', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each([
    '',
    'fromChainId=1&toChainId=1',
    'fromChainId=1&toChainId=10',
    'fromChainId=-4&toChainId=999',
    'fromChainId=https://example.com&toChainId=-4',
  ])(
    'rejects unsupported route parameters without contacting Scan (%s)',
    async (params) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      const response = await GET(
        new NextRequest(
          `http://localhost/api/cross-chain/layerzero/arrival-estimate?${params}`,
        ),
      )
      expect(response.status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

  it('caches route-level timing and returns null for insufficient history', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const response = await GET(
      new NextRequest(
        'http://localhost/api/cross-chain/layerzero/arrival-estimate?fromChainId=-4&toChainId=1',
      ),
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ estimatedSeconds: null })
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        'https://scan.layerzero-api.com/v1/messages/latest?srcChainIds=30600&dstChainIds=30101',
      ),
      expect.objectContaining({ next: { revalidate: 300 } }),
    )
  })

  it.each([
    Response.json({ message: 'rate limit' }, { status: 429 }),
    Response.json({ invalid: true }),
  ])(
    'returns an unavailable estimate for failed or malformed Scan responses',
    async (upstreamResponse) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(upstreamResponse))
      const response = await GET(
        new NextRequest(
          'http://localhost/api/cross-chain/layerzero/arrival-estimate?fromChainId=1&toChainId=-4',
        ),
      )
      expect(response.status).toBe(502)
      expect(await response.json()).toEqual({
        message: 'LayerZero timing unavailable',
      })
      expect(response.headers.get('Cache-Control')).toBeNull()
    },
  )
})
