import { describe, expect, it } from 'vitest'
import {
  getLaunchpadProviderConfig,
  getLaunchpadProviderIconsForFilter,
  getLaunchpadProvidersForFilter,
  launchpadProviderHasCapability,
  parseLaunchpadProviderFilter,
} from './launchpad-provider'

describe('launchpad provider policy', () => {
  it('defaults Discover to every supported provider', () => {
    expect(parseLaunchpadProviderFilter(null)).toBe('all')
    expect(parseLaunchpadProviderFilter('unknown')).toBe('all')
    expect(getLaunchpadProvidersForFilter('all')).toEqual([
      'SUSHI_V1',
      'SUSHI_V2',
      'POOLS_FUN_V1',
      'POOLS_FUN_V2',
      'POOLS_FUN_V3',
    ])
  })

  it('maps provider filters to provider families', () => {
    expect(getLaunchpadProvidersForFilter('sushi')).toEqual([
      'SUSHI_V1',
      'SUSHI_V2',
    ])
    expect(getLaunchpadProvidersForFilter('pools-fun')).toEqual([
      'POOLS_FUN_V1',
      'POOLS_FUN_V2',
      'POOLS_FUN_V3',
    ])
  })

  it('shows one icon for each provider family', () => {
    expect(getLaunchpadProviderIconsForFilter('all')).toEqual([
      'SUSHI_V1',
      'POOLS_FUN_V1',
    ])
    expect(getLaunchpadProviderIconsForFilter('sushi')).toEqual(['SUSHI_V1'])
  })

  it.each(['POOLS_FUN_V1', 'POOLS_FUN_V2', 'POOLS_FUN_V3'] as const)(
    'keeps %s creator tools disabled and links to its site',
    (provider) => {
      expect(launchpadProviderHasCapability(provider, 'manage')).toBe(false)
      expect(launchpadProviderHasCapability(provider, 'metadata')).toBe(false)
      expect(launchpadProviderHasCapability(provider, 'creatorProfile')).toBe(
        false,
      )
      expect(getLaunchpadProviderConfig(provider).websiteUrl).toBe(
        'https://pools.fun',
      )
    },
  )
})
