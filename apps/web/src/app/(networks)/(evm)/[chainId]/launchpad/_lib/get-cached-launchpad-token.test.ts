import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cache, getLaunchpadTokenMock } = vi.hoisted(() => ({
  cache: new Map<string, unknown>(),
  getLaunchpadTokenMock: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadToken: getLaunchpadTokenMock,
}))

vi.mock('next/cache', () => ({
  unstable_cache:
    (callback: () => Promise<unknown>, keyParts: string[]) => async () => {
      const key = JSON.stringify(keyParts)
      if (cache.has(key)) return cache.get(key)

      const value = await callback()
      cache.set(key, value)
      return value
    },
}))

import { getCachedLaunchpadToken } from './get-cached-launchpad-token'

const input = {
  chainId: 4663,
  address: '0x0000000000000000000000000000000000000001',
} as const

describe('getCachedLaunchpadToken', () => {
  beforeEach(() => {
    cache.clear()
    getLaunchpadTokenMock.mockReset()
  })

  it('does not cache a missing token', async () => {
    const token = { id: 'launchpad-token' }
    getLaunchpadTokenMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(token)

    await expect(getCachedLaunchpadToken(input)).resolves.toBeNull()
    await expect(getCachedLaunchpadToken(input)).resolves.toBe(token)
    expect(getLaunchpadTokenMock).toHaveBeenCalledTimes(2)
  })

  it('does not mask API errors', async () => {
    const error = new Error('API unavailable')
    getLaunchpadTokenMock.mockRejectedValueOnce(error)

    await expect(getCachedLaunchpadToken(input)).rejects.toBe(error)
  })
})
