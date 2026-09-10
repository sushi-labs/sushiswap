import { describe, expect, it } from 'vitest'
import { GET } from './route'

describe('GET /api/geolocation', () => {
  it('reads the requesting visitor country and prevents shared caching', async () => {
    for (const countryCode of ['US', 'DE']) {
      const response = GET(
        new Request('https://sushi.com/api/geolocation', {
          headers: { 'x-vercel-ip-country': countryCode },
        }),
      )
      expect(await response.json()).toEqual({ countryCode })
      expect(response.headers.get('Cache-Control')).toBe('private, no-store')
    }
  })

  it('returns an explicit unknown country when Vercel has no location', async () => {
    const response = GET(new Request('http://localhost/api/geolocation'))
    expect(await response.json()).toEqual({ countryCode: null })
  })
})
