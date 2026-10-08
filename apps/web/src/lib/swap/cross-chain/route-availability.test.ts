import { describe, expect, it } from 'vitest'
import {
  getPreferredProvider,
  isLifiNoRouteResponse,
  isNoRouteResponse,
} from './route-availability'

describe('cross-chain provider priority', () => {
  it('keeps LI.FI until it definitively has no route', () => {
    for (const state of ['idle', 'loading', 'available', 'error'] as const)
      expect(getPreferredProvider(state, 'available')).toBe('lifi')
  })

  it('tries NEAR before VT and does not hide NEAR failures', () => {
    for (const state of ['idle', 'loading', 'available', 'error'] as const)
      expect(getPreferredProvider('empty', state)).toBe('near-intents')
  })

  it('uses VT only after both higher-priority providers lack a route', () => {
    for (const lifi of ['unsupported', 'empty'] as const)
      for (const near of ['unsupported', 'empty'] as const)
        expect(getPreferredProvider(lifi, near)).toBe('layerzero')
  })

  it('does not classify authorization, validation, or transport failures as no route', () => {
    expect(isNoRouteResponse(400, { message: 'No quotes found' })).toBe(true)
    expect(isNoRouteResponse(404, { code: 'NO_ROUTE' })).toBe(true)
    expect(isNoRouteResponse(401, { message: 'No quotes found' })).toBe(false)
    expect(isNoRouteResponse(429, { code: 'NO_ROUTE' })).toBe(false)
    expect(isNoRouteResponse(500, { message: 'No quotes found' })).toBe(false)
    expect(isNoRouteResponse(400, { message: 'Invalid recipient' })).toBe(false)
  })

  it('only normalizes LI.FI NoQuoteError responses for unavailable routes', () => {
    expect(isLifiNoRouteResponse(404, { code: 1002 })).toBe(true)
    for (const status of [401, 403, 429, 500])
      expect(isLifiNoRouteResponse(status, { code: 1002 })).toBe(false)
    expect(isLifiNoRouteResponse(400, { code: 1011 })).toBe(false)
    expect(isLifiNoRouteResponse(400, null)).toBe(false)
  })
})
