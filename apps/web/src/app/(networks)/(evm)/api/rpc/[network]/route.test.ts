import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { POST } from './route'

const { checkBotId } = vi.hoisted(() => ({ checkBotId: vi.fn() }))
vi.mock('botid/server', () => ({ checkBotId }))

const fetch = vi.fn()

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubEnv('DRPC_ID', 'server-key')
  vi.stubGlobal('fetch', fetch)
  checkBotId.mockResolvedValue({ isBot: false })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function request(body: string, network = 'ethereum') {
  return POST(
    new Request(
      `https://sushi.com/api/rpc/${encodeURIComponent(network)}?dkey=ignored`,
      {
        method: 'POST',
        headers: { Authorization: 'caller-jwt', 'Drpc-Key': 'caller-key' },
        body,
      },
    ),
    { params: Promise.resolve({ network }) },
  )
}

it.each(['ethereum', 'solana', 'stellar'])(
  'verifies Basic and forwards the exact body to %s with private credentials',
  async (network) => {
    const body =
      ' [ { "jsonrpc": "2.0", "id": "one", "method": "custom_method", "params": [] } ]\n'
    const result =
      '[{"jsonrpc":"2.0","id":"one","error":{"code":-32601,"message":"Not allowed"}}]'
    fetch.mockResolvedValue(
      new Response(result, {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '2',
          'Set-Cookie': 'upstream=private',
        },
      }),
    )

    const response = await request(body, network)

    expect(checkBotId).toHaveBeenCalledWith({
      advancedOptions: { checkLevel: 'basic' },
    })
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      `https://lb.drpc.live/${network}`,
      expect.objectContaining({
        method: 'POST',
        body: new TextEncoder().encode(body).buffer,
        headers: {
          'Content-Type': 'application/json',
          'Drpc-Key': 'server-key',
        },
        redirect: 'error',
        cache: 'no-store',
      }),
    )
    expect(response.status).toBe(429)
    expect(await response.text()).toBe(result)
    expect(response.headers.get('Retry-After')).toBe('2')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.has('Set-Cookie')).toBe(false)
  },
)

it('checks every request and blocks bots before reaching DRPC', async () => {
  checkBotId.mockResolvedValue({ isBot: true })
  expect((await request('{}')).status).toBe(403)
  expect((await request('{}')).status).toBe(403)
  expect(checkBotId).toHaveBeenCalledTimes(2)
  expect(fetch).not.toHaveBeenCalled()
})

it('fails closed when verification fails or the server credential is missing', async () => {
  checkBotId.mockRejectedValueOnce(new Error('Verification unavailable'))
  expect((await request('{}')).status).toBe(503)
  vi.stubEnv('DRPC_ID', '')
  expect((await request('{}')).status).toBe(503)
  expect(fetch).not.toHaveBeenCalled()
})

it.each([
  '../ethereum',
  'ethereum?network=solana',
  'https://example.com',
  'ethereum/other-key',
])('rejects an invalid network path: %s', async (network) => {
  expect((await request('{}', network)).status).toBe(400)
  expect(fetch).not.toHaveBeenCalled()
})

it('does not expose upstream failures or credentials', async () => {
  fetch.mockRejectedValue(new Error('Failed with server-key'))
  const response = await request('{}')
  expect(response.status).toBe(502)
  expect(await response.json()).toEqual({ error: 'RPC unavailable' })
})
