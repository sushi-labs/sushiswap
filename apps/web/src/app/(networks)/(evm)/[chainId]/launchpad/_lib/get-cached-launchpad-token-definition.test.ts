import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cacheLifeMock, getLaunchpadTokenDefinitionMock } = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  getLaunchpadTokenDefinitionMock: vi.fn<() => Promise<unknown>>(),
}))

vi.mock('@sushiswap/graph-client/data-api', () => ({
  getLaunchpadTokenDefinition: getLaunchpadTokenDefinitionMock,
}))

vi.mock('next/cache', () => ({
  cacheLife: cacheLifeMock,
}))

import { getCachedLaunchpadTokenDefinition } from './get-cached-launchpad-token-definition'

const input = {
  chainId: 4663,
  address: '0x0000000000000000000000000000000000000001',
} as const

describe('getCachedLaunchpadTokenDefinition', () => {
  beforeEach(() => {
    cacheLifeMock.mockReset()
    getLaunchpadTokenDefinitionMock.mockReset()
  })

  it('revalidates launch existence hourly', async () => {
    getLaunchpadTokenDefinitionMock.mockResolvedValueOnce({
      id: 'launchpad-token',
    })

    await getCachedLaunchpadTokenDefinition(input)

    expect(cacheLifeMock).toHaveBeenCalledWith({ revalidate: 60 * 60 })
  })

  it('does not cache a missing definition', async () => {
    const definition = { id: 'launchpad-token' }
    getLaunchpadTokenDefinitionMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(definition)

    await expect(
      getCachedLaunchpadTokenDefinition(input),
    ).rejects.toMatchObject({ digest: 'NEXT_HTTP_ERROR_FALLBACK;404' })
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
