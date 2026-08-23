import type { LaunchpadProvider } from '@sushiswap/graph-client/data-api'

interface LaunchpadProviderCapabilities {
  creatorProfile: boolean
  manage: boolean
  metadata: boolean
}

interface LaunchpadProviderConfig {
  capabilities: LaunchpadProviderCapabilities
  label: string
  websiteUrl?: string
}

export const LAUNCHPAD_PROVIDER_CONFIG = {
  SUSHI_V1: {
    label: 'Sushi',
    capabilities: {
      creatorProfile: true,
      manage: true,
      metadata: true,
    },
  },
  SUSHI_V2: {
    label: 'Sushi V2',
    capabilities: {
      creatorProfile: true,
      manage: true,
      metadata: true,
    },
  },
  POOLS_FUN_V1: {
    label: 'Pools',
    websiteUrl: 'https://pools.fun',
    capabilities: {
      creatorProfile: false,
      manage: false,
      metadata: false,
    },
  },
} as const satisfies Record<LaunchpadProvider, LaunchpadProviderConfig>

export type LaunchpadProviderFilter = 'all' | 'sushi' | 'pools-fun'

export const LAUNCHPAD_PROVIDER_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Sushi', value: 'sushi' },
  { label: 'Pools', value: 'pools-fun' },
] as const satisfies readonly {
  label: string
  value: LaunchpadProviderFilter
}[]

const PROVIDERS_BY_FILTER = {
  all: ['SUSHI_V1', 'SUSHI_V2', 'POOLS_FUN_V1'],
  sushi: ['SUSHI_V1', 'SUSHI_V2'],
  'pools-fun': ['POOLS_FUN_V1'],
} as const satisfies Record<
  LaunchpadProviderFilter,
  readonly LaunchpadProvider[]
>

const ICON_PROVIDERS_BY_FILTER = {
  all: ['SUSHI_V1', 'POOLS_FUN_V1'],
  sushi: ['SUSHI_V1'],
  'pools-fun': ['POOLS_FUN_V1'],
} as const satisfies Record<
  LaunchpadProviderFilter,
  readonly LaunchpadProvider[]
>

export function getLaunchpadProviderConfig(
  provider: LaunchpadProvider,
): LaunchpadProviderConfig {
  return LAUNCHPAD_PROVIDER_CONFIG[provider]
}

export function getLaunchpadProvidersForFilter(
  filter: LaunchpadProviderFilter,
): LaunchpadProvider[] {
  return [...PROVIDERS_BY_FILTER[filter]]
}

export function getLaunchpadProviderIconsForFilter(
  filter: LaunchpadProviderFilter,
): LaunchpadProvider[] {
  return [...ICON_PROVIDERS_BY_FILTER[filter]]
}

function isLaunchpadProviderFilter(
  value: string | null,
): value is LaunchpadProviderFilter {
  return LAUNCHPAD_PROVIDER_FILTERS.some((option) => option.value === value)
}

export function parseLaunchpadProviderFilter(
  value: string | null,
): LaunchpadProviderFilter {
  return isLaunchpadProviderFilter(value) ? value : 'all'
}

export function launchpadProviderHasCapability(
  provider: LaunchpadProvider,
  capability: keyof LaunchpadProviderCapabilities,
): boolean {
  return getLaunchpadProviderConfig(provider).capabilities[capability]
}
