import { beforeAll, describe, expect, it, vi } from 'vitest'

/**
 * Guards `patches/viem@2.55.0.patch`.
 *
 * Sushi's dRPC endpoints reject every request without an `Authorization` JWT.
 * Dependencies build their own viem clients without fetch options — Privy alone
 * does so in about nine places, and only the client it passes options to could
 * be patched directly — so the credential is attached inside viem's HTTP
 * client, where it covers all of them.
 */
async function requestHeaders(
  url: string,
  fetchOptions?: { headers?: Record<string, string> },
): Promise<Record<string, string>> {
  const { getHttpRpcClient } = await import('viem/utils')

  let headers: Record<string, string> = {}
  const fetchFn = (async (_url: string, init: RequestInit) => {
    headers = init.headers as Record<string, string>
    return new Response('{"result":"0x1"}', {
      headers: { 'Content-Type': 'application/json' },
    })
  }) as unknown as typeof fetch

  await getHttpRpcClient(url, { fetchFn }).request({
    body: { method: 'eth_chainId' },
    ...(fetchOptions ? { fetchOptions } : {}),
  })
  return headers
}

const drpcUrl = 'https://lb.drpc.live/ogrpc?network=robinhood&dkey=test-key'

describe('dRPC authorization', () => {
  // The patch reads the JWT once, when viem's module is evaluated, and
  // `vi.resetModules()` does not re-evaluate externalized dependencies. Stub
  // the environment before the first import instead.
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_DRPC_JWT', 'test-jwt')
  })

  it('authenticates clients that pass no fetch options', async () => {
    const headers = await requestHeaders(drpcUrl)

    expect(headers.Authorization).toBe('test-jwt')
    expect(headers['Content-Type']).toBe('application/json')
  })

  it("keeps a caller's own credential", async () => {
    const headers = await requestHeaders(drpcUrl, {
      headers: { Authorization: 'caller-jwt' },
    })

    expect(headers.Authorization).toBe('caller-jwt')
  })

  it('leaves other hosts untouched', async () => {
    const headers = await requestHeaders(
      'https://rpc.mainnet.chain.robinhood.com',
    )

    expect(headers.Authorization).toBeUndefined()
  })
})
