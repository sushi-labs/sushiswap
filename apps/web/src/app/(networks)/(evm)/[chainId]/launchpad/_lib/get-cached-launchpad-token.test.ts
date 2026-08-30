import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cacheLifeMock, getLaunchpadTokenMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  getLaunchpadTokenMock: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadToken: getLaunchpadTokenMock,
}))

vi.mock('next/cache', () => ({
  cacheLife: cacheLifeMock,
}))

import { getCachedLaunchpadToken } from './get-cached-launchpad-token'

const input = {
  chainId: 4663,
  address: '0x0000000000000000000000000000000000000001',
} as const

describe('getCachedLaunchpadToken', () => {
  beforeEach(() => {
    cacheLifeMock.mockReset()
    getLaunchpadTokenMock.mockReset()
  })

  it('revalidates cached tokens hourly', async () => {
    getLaunchpadTokenMock.mockResolvedValueOnce({ id: 'launchpad-token' })

    await getCachedLaunchpadToken(input)

    expect(cacheLifeMock).toHaveBeenCalledWith({ revalidate: 60 * 60 })
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
