import type { GetPoolsArgs } from '@sushiswap/client'
import { Protocol } from '@sushiswap/database'

import { AMM_SUPPORTED_CHAIN_IDS } from '../config'

export const L2_DEADLINE_FROM_NOW = BigInt(60) * BigInt(5)

// export const POOL_VERSION_MAP: Record<PoolVersion, string> = {
//   LEGACY: 'Legacy',
//   TRIDENT: 'Trident',
//   V3: 'V3',
// }

// export const AVAILABLE_VERSION_MAP: Partial<typeof POOL_VERSION_MAP> = {
//   LEGACY: 'Legacy',
//   TRIDENT: 'Trident',
//   V3: 'V3',
// }

// export const POOL_TYPE_MAP: Record<PoolType, string> = {
//   CONSTANT_PRODUCT_POOL: 'Classic Pool',
//   CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Liquidity Pool',
//   STABLE_POOL: 'Stable Pool',
// }

// export const AVAILABLE_POOL_TYPE_MAP: Partial<typeof POOL_TYPE_MAP> = {
//   CONSTANT_PRODUCT_POOL: 'Classic Pool',
//   STABLE_POOL: 'Stable Pool',
//   CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Pool',
// }

export const PROTOCOL_MAP: Record<Protocol, string> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
  BENTOBOX_STABLE: 'Trident Stable',
  BENTOBOX_CLASSIC: 'Trident Classic',
} as const

export const AVAILABLE_PROTOCOL_MAP: Partial<typeof PROTOCOL_MAP> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
  BENTOBOX_STABLE: 'Trident Stable',
  BENTOBOX_CLASSIC: 'Trident Classic',
} as const

// ! Has to be kept up to date with default filters
// Else prefetching won't work
export const defaultPoolsArgs: GetPoolsArgs = {
  chainIds: AMM_SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  protocols: Object.values(Protocol),
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

export const APPROVE_TAG_ADD_LEGACY = 'APPROVE_TAG_ADD_LEGACY'
export const APPROVE_TAG_ADD_TRIDENT = 'APPROVE_TAG_ADD_TRIDENT'
export const APPROVE_TAG_REMOVE_TRIDENT = 'APPROVE_TAG_REMOVE_TRIDENT'
export const APPROVE_TAG_REMOVE_LEGACY = 'APPROVE_TAG_REMOVE_LEGACY'
export const APPROVE_TAG_CREATE_TRIDENT = 'APPROVE_TAG_CREATE_TRIDENT'
export const APPROVE_TAG_STAKE = 'APPROVE_TAG_STAKE'
export const APPROVE_TAG_UNSTAKE = 'APPROVE_TAG_UNSTAKE'
export const APPROVE_TAG_MIGRATE = 'APPROVE_TAG_MIGRATE'
export const APPROVE_TAG_XSWAP = 'APPROVE_TAG_XSWAP'
export const APPROVE_TAG_SWAP = 'APPROVE_TAG_SWAP'
export const APPROVE_TAG_STEER = 'APPROVE_TAG_STEER'
export const APPROVE_TAG_BONDS = 'APPROVE_TAG_BONDS'
