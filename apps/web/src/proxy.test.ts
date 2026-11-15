import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from './proxy'

describe('limit order routes', () => {
  it.each([
    [undefined, '/ethereum/limit-legacy'],
    [747474, '/katana/limit-legacy'],
  ])(
    'redirects legacy orders using the existing chain preference (%s)',
    async (chainId, destination) => {
      const request = new NextRequest('http://localhost/limit-legacy')
      if (chainId !== undefined)
        request.cookies.set(
          'wagmi.store',
          JSON.stringify({ state: { chainId } }),
        )
      const response = await proxy(request)
      expect(response.headers.get('location')).toBe(
        `http://localhost${destination}`,
      )
    },
  )
  it('rewrites the legacy route using existing network routing', async () => {
    const response = await proxy(
      new NextRequest('http://localhost/base/limit-legacy?token0=NATIVE'),
    )
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'http://localhost/8453/limit-legacy?token0=NATIVE',
    )
  })
})
