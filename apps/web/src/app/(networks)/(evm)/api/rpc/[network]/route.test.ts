import { afterEach, beforeEach, expect, it, vi } from 'vitest'

let POST: typeof import('./route').POST

const { checkBotId, cache } = vi.hoisted(() => ({
  checkBotId: vi.fn(),
  cache: {
    get: vi.fn<(key: string) => Promise<unknown>>(),
    set: vi.fn<
      (key: string, value: unknown, options: { ttl: number }) => Promise<void>
    >(),
  },
}))
vi.mock('botid/server', () => ({ checkBotId }))
vi.mock('@vercel/functions', () => ({ getCache: () => cache }))

const fetch = vi.fn()

beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  vi.stubEnv('DRPC_ID', 'server-key')
  vi.stubGlobal('fetch', fetch)
  checkBotId.mockResolvedValue({ isBot: false })
  const entries = new Map<string, unknown>()
  cache.get.mockImplementation(async (key) => entries.get(key) ?? null)
  cache.set.mockImplementation(async (key, value) => {
    entries.set(key, value)
  })
  ;({ POST } = await import('./route'))
})

afterEach(() => {
  vi.useRealTimers()
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

function blockNumberRequest(id: string | number | null) {
  return JSON.stringify({ jsonrpc: '2.0', id, method: 'eth_blockNumber' })
}

it('shares block numbers across instances for one second per network and preserves caller IDs', async () => {
  vi.useFakeTimers()
  fetch.mockImplementation(() =>
    Response.json({ jsonrpc: '2.0', id: 1, result: '0x123' }),
  )

  expect(await (await request(blockNumberRequest(1))).json()).toEqual({
    jsonrpc: '2.0',
    id: 1,
    result: '0x123',
  })
  expect(cache.set).toHaveBeenCalledWith(
    'ethereum',
    { result: '0x123', expiresAt: Date.now() + 1_000 },
    { ttl: 1 },
  )
  // A fresh module has no instance-local state but can read the shared cache.
  vi.resetModules()
  ;({ POST } = await import('./route'))
  vi.advanceTimersByTime(999)
  for (const id of ['second', 0, null]) {
    const response = await request(blockNumberRequest(id))
    expect(await response.json()).toEqual({
      jsonrpc: '2.0',
      id,
      result: '0x123',
    })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  }
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(checkBotId).toHaveBeenCalledTimes(4)

  await request(blockNumberRequest(1), 'base')
  expect(fetch).toHaveBeenCalledTimes(2)

  vi.advanceTimersByTime(1)
  fetch.mockResolvedValueOnce(
    Response.json({ jsonrpc: '2.0', id: 2, result: '0x124' }),
  )
  expect(await (await request(blockNumberRequest(2))).json()).toEqual({
    jsonrpc: '2.0',
    id: 2,
    result: '0x124',
  })
  expect(fetch).toHaveBeenCalledTimes(3)
})

it('keeps cached block numbers behind BotID and credential checks', async () => {
  fetch.mockResolvedValueOnce(
    Response.json({ jsonrpc: '2.0', id: 1, result: '0x123' }),
  )
  await request(blockNumberRequest(1))

  checkBotId.mockResolvedValueOnce({ isBot: true })
  expect((await request(blockNumberRequest(2))).status).toBe(403)
  checkBotId.mockRejectedValueOnce(new Error('Unavailable'))
  expect((await request(blockNumberRequest(3))).status).toBe(503)
  vi.stubEnv('DRPC_ID', '')
  expect((await request(blockNumberRequest(4))).status).toBe(503)
  expect(fetch).toHaveBeenCalledTimes(1)
})

it.each([
  [200, { jsonrpc: '2.0', id: 1, error: { code: -32000 } }],
  [429, { jsonrpc: '2.0', id: 1, result: '0x123' }],
  [200, { jsonrpc: '2.0', id: 1, result: 'invalid' }],
  [200, { jsonrpc: '2.0', id: 99, result: '0x123' }],
  [200, { jsonrpc: '2.0', id: 1, result: '0x123', error: {} }],
  [200, 'invalid JSON'],
])(
  'does not cache an unsuccessful or invalid response: %s %j',
  async (status, body) => {
    const responseBody = typeof body === 'string' ? body : JSON.stringify(body)
    fetch.mockImplementation(() => new Response(responseBody, { status }))

    expect(await (await request(blockNumberRequest(1))).text()).toBe(
      responseBody,
    )
    expect(await (await request(blockNumberRequest(1))).text()).toBe(
      responseBody,
    )
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(cache.set).not.toHaveBeenCalled()
  },
)

it.each([
  '{',
  'null',
  '[{"jsonrpc":"2.0","id":2,"method":"eth_blockNumber"}]',
  '{"jsonrpc":"2.0","id":2,"method":"eth_chainId"}',
  '{"jsonrpc":"2.0","id":2,"method":"eth_blockNumber","params":["latest"]}',
  '{"jsonrpc":"2.0","method":"eth_blockNumber"}',
])('forwards non-cacheable requests unchanged: %s', async (body) => {
  fetch.mockImplementation(() =>
    Response.json({ jsonrpc: '2.0', id: 1, result: '0x123' }),
  )
  await request(blockNumberRequest(1))
  await request(body)

  expect(fetch).toHaveBeenCalledTimes(2)
  expect(cache.get).toHaveBeenCalledTimes(1)
  expect(fetch).toHaveBeenLastCalledWith(
    'https://lb.drpc.live/ethereum',
    expect.objectContaining({ body: new TextEncoder().encode(body).buffer }),
  )
})

it('continues serving RPC responses when the cache is unavailable', async () => {
  cache.get.mockRejectedValue(new Error('Cache read unavailable'))
  cache.set.mockRejectedValue(new Error('Cache write unavailable'))
  const result = { jsonrpc: '2.0', id: 1, result: '0x123' }
  fetch.mockResolvedValueOnce(Response.json(result))

  const response = await request(blockNumberRequest(1))
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual(result)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(cache.set).toHaveBeenCalledTimes(1)
})

it('ignores invalid cached block numbers', async () => {
  cache.get.mockResolvedValueOnce({
    result: 'invalid',
    expiresAt: Date.now() + 1_000,
  })
  const result = { jsonrpc: '2.0', id: 1, result: '0x123' }
  fetch.mockResolvedValueOnce(Response.json(result))

  expect(await (await request(blockNumberRequest(1))).json()).toEqual(result)
  expect(fetch).toHaveBeenCalledTimes(1)
})
