import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cache, cacheConfigurations, getLaunchpadTokenDefinitionMock } =
  vi.hoisted(() => ({
    cache: new Map<string, unknown>(),
    cacheConfigurations: [] as unknown[],
    getLaunchpadTokenDefinitionMock: vi.fn<() => Promise<unknown>>(),
  }))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadTokenDefinition: getLaunchpadTokenDefinitionMock,
}))

vi.mock('next/cache', () => ({
  unstable_cache: (
    callback: () => Promise<unknown>,
    keyParts: string[],
    configuration: unknown,
  ) => {
    cacheConfigurations.push(configuration)

    return async () => {
      const key = JSON.stringify(keyParts)
      if (cache.has(key)) return cache.get(key)

      const value = await callback()
      cache.set(key, value)
      return value
    }
  },
}))

import { getCachedLaunchpadTokenDefinition } from './get-cached-launchpad-token-definition'

const input = {
  chainId: 4663,
  address: '0x0000000000000000000000000000000000000001',
} as const

describe('getCachedLaunchpadTokenDefinition', () => {
  beforeEach(() => {
    cache.clear()
    cacheConfigurations.length = 0
    getLaunchpadTokenDefinitionMock.mockReset()
  })

  it('revalidates launch existence hourly', async () => {
    getLaunchpadTokenDefinitionMock.mockResolvedValueOnce({
      id: 'launchpad-token',
    })

    await getCachedLaunchpadTokenDefinition(input)

    expect(cacheConfigurations).toContainEqual({ revalidate: 60 * 60 })
  })

  it('does not cache a missing definition', async () => {
    const definition = { id: 'launchpad-token' }
    getLaunchpadTokenDefinitionMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(definition)

    await expect(getCachedLaunchpadTokenDefinition(input)).resolves.toBeNull()
    await expect(getCachedLaunchpadTokenDefinition(input)).resolves.toBe(
      definition,
    )
    expect(getLaunchpadTokenDefinitionMock).toHaveBeenCalledTimes(2)
  })

  it('does not mask API errors', async () => {
    const error = new Error('API unavailable')
    getLaunchpadTokenDefinitionMock.mockRejectedValueOnce(error)

    await expect(getCachedLaunchpadTokenDefinition(input)).rejects.toBe(error)
  })
})
