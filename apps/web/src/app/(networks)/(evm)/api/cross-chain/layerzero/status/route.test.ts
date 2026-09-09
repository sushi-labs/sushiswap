import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

const stellarTxHash =
  '83559daf39922289cf828031afe7ec4bee6f6fea03a33b50d5b6db4b8cefb7ea'

function request(txHash = stellarTxHash, fromChainId = -4, toChainId = 10) {
  const params = new URLSearchParams({
    txHash,
    fromChainId: String(fromChainId),
    toChainId: String(toChainId),
  })
  return new NextRequest(
    `http://localhost/api/cross-chain/layerzero/status?${params}`,
  )
}

describe('LayerZero status API', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('keeps an unindexed Stellar transaction pending, then reports destination delivery', async () => {
    const destinationTxHash = `0x${'a'.repeat(64)}`
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json(
          { message: `Message not found for tx ${stellarTxHash}!`, code: 4040 },
          { status: 404 },
        ),
      )
      .mockResolvedValueOnce(
        Response.json({
          data: [
            {
              pathway: { srcEid: 30600, dstEid: 30111 },
              status: { name: 'DELIVERED' },
              destination: { tx: { txHash: destinationTxHash } },
            },
          ],
        }),
      )
    vi.stubGlobal('fetch', fetchMock)

    const pending = await GET(request())
    expect(pending.status).toBe(200)
    expect(await pending.json()).toEqual({ status: 'PENDING' })
    expect(pending.headers.get('Cache-Control')).toBe('no-store')
    expect(fetchMock).toHaveBeenCalledWith(
      `https://scan.layerzero-api.com/v1/messages/tx/${stellarTxHash}`,
      expect.objectContaining({ cache: 'no-store' }),
    )

    const delivered = await GET(request())
    expect(delivered.status).toBe(200)
    expect(await delivered.json()).toEqual({
      status: 'SUCCESS',
      destinationTxHash,
    })
  })

  it('preserves the 0x prefix for an EVM source transaction', async () => {
    const txHash = `0x${'b'.repeat(64)}`
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const response = await GET(request(txHash, 10, -4))
    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledWith(
      `https://scan.layerzero-api.com/v1/messages/tx/${txHash}`,
      expect.any(Object),
    )
  })

  it.each([
    Response.json({ message: 'Unknown endpoint' }, { status: 404 }),
    Response.json({ code: 4040 }, { status: 500 }),
    Response.json({ message: 'Rate limited' }, { status: 429 }),
    Response.json({ data: null }),
    new Response('Unavailable', { status: 503 }),
  ])(
    'keeps actual upstream errors distinct from pending messages',
    async (upstream) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(upstream))
      const response = await GET(request())
      expect(response.status).toBe(502)
      expect(await response.json()).toEqual({
        message: 'LayerZero status unavailable',
      })
    },
  )

  it.each([
    ['invalid-hash', -4, 10],
    [stellarTxHash, -4, 999],
    [stellarTxHash, 999, 10],
    [stellarTxHash, -4, -4],
    [stellarTxHash, 1, 10],
  ] as const)(
    'rejects invalid transfer parameters (%s, %s, %s)',
    async (hash, from, to) => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)
      expect((await GET(request(hash, from, to))).status).toBe(400)
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )
})
