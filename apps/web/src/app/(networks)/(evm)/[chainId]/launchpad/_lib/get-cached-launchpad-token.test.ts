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

import {
  getCachedLaunchpadToken,
  getCachedLaunchpadTokenIdentity,
} from './get-cached-launchpad-token'

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

  it('caches only immutable token identity fields', async () => {
    const token = {
      address: input.address,
      chainId: input.chainId,
      creator: '0x0000000000000000000000000000000000000002',
      decimals: 18,
      metrics: { priceUsd: 1 },
      name: 'Token',
      provider: 'SUSHI_V1',
      symbol: 'TKN',
    }
    getLaunchpadTokenMock.mockResolvedValueOnce(token)

    await expect(getCachedLaunchpadTokenIdentity(input)).resolves.toEqual({
      address: token.address,
      chainId: token.chainId,
      creator: token.creator,
      decimals: token.decimals,
      name: token.name,
      provider: token.provider,
      symbol: token.symbol,
    })
    await expect(getCachedLaunchpadTokenIdentity(input)).resolves.toEqual({
      address: token.address,
      chainId: token.chainId,
      creator: token.creator,
      decimals: token.decimals,
      name: token.name,
      provider: token.provider,
      symbol: token.symbol,
    })
    expect(getLaunchpadTokenMock).toHaveBeenCalledTimes(1)
  })

  it('does not negatively cache a missing token identity', async () => {
    const token = {
      address: input.address,
      chainId: input.chainId,
      creator: '0x0000000000000000000000000000000000000002',
      decimals: 18,
      name: 'Token',
      provider: 'SUSHI_V1',
      symbol: 'TKN',
    }
    getLaunchpadTokenMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(token)

    await expect(getCachedLaunchpadTokenIdentity(input)).resolves.toBeNull()
    await expect(getCachedLaunchpadTokenIdentity(input)).resolves.toMatchObject(
      token,
    )
    expect(getLaunchpadTokenMock).toHaveBeenCalledTimes(2)
  })
})
