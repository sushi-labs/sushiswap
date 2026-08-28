import { afterEach, describe, expect, it, vi } from 'vitest'
import { sendAnalyticsEvent } from './send-analytics-event'

describe('sendAnalyticsEvent', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('forwards an event to gtag and the data layer', () => {
    const gtag = vi.fn()
    const dataLayer: Record<string, unknown>[] = []
    vi.stubGlobal('window', { dataLayer, gtag })

    sendAnalyticsEvent('swap', { chainId: 1 })

    expect(gtag).toHaveBeenCalledWith('event', 'swap', { chainId: 1 })
    expect(dataLayer).toEqual([{ event: 'swap', chainId: 1 }])
  })

  it('does not throw when analytics globals are unavailable', () => {
    vi.stubGlobal('window', {})
    expect(() => sendAnalyticsEvent('swap')).not.toThrow()
  })
})
