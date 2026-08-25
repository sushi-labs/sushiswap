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
    ])
  })

  it('maps provider filters to provider families', () => {
    expect(getLaunchpadProvidersForFilter('sushi')).toEqual([
      'SUSHI_V1',
      'SUSHI_V2',
    ])
    expect(getLaunchpadProvidersForFilter('pools-fun')).toEqual([
      'POOLS_FUN_V1',
    ])
  })

  it('shows one icon for each provider family', () => {
    expect(getLaunchpadProviderIconsForFilter('all')).toEqual([
      'SUSHI_V1',
      'POOLS_FUN_V1',
    ])
    expect(getLaunchpadProviderIconsForFilter('sushi')).toEqual(['SUSHI_V1'])
  })

  it('keeps Pools.fun creator tools disabled and links to its site', () => {
    expect(launchpadProviderHasCapability('POOLS_FUN_V1', 'manage')).toBe(false)
    expect(launchpadProviderHasCapability('POOLS_FUN_V1', 'metadata')).toBe(
      false,
    )
    expect(getLaunchpadProviderConfig('POOLS_FUN_V1').websiteUrl).toBe(
      'https://pools.fun',
    )
  })
})
