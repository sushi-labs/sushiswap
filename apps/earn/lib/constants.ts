import { GetPoolsArgs, PoolType, PoolVersion } from '@sushiswap/client'
import { SUPPORTED_CHAIN_IDS } from '../config'

export const L2_DEADLINE_FROM_NOW = 60 * 5

export const POOL_VERSION_MAP: Record<PoolVersion, string> = {
  LEGACY: 'Legacy',
  TRIDENT: 'Trident',
  V3: 'V3',
}

export const AVAILABLE_VERSION_MAP: Partial<typeof POOL_VERSION_MAP> = {
  LEGACY: 'Legacy',
  TRIDENT: 'Trident',
  V3: 'V3',
}

export const POOL_TYPE_MAP: Record<PoolType, string> = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Liquidity Pool',
  STABLE_POOL: 'Stable Pool',
}

export const AVAILABLE_POOL_TYPE_MAP: Partial<typeof POOL_TYPE_MAP> = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  STABLE_POOL: 'Stable Pool',
  CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Pool',
}

export const AVAILABLE_PROTOCOL_MAP = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
  BENTOBOX_STABLE: 'BentoBox Stable',
  BENTOBOX_CLASSIC: 'BentoBox Classic',
} as const

// ! Has to be kept up to date with default filters
// Else prefetching won't work
export const defaultPoolsArgs: GetPoolsArgs = {
  chainIds: SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  protocols: Object.keys(AVAILABLE_PROTOCOL_MAP),
  // poolTypes: Object.keys(AVAILABLE_POOL_TYPE_MAP) as PoolType[],
  // poolVersions: Object.keys(AVAILABLE_VERSION_MAP) as PoolVersion[],
  isWhitelisted: true,
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export enum Field {
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}
