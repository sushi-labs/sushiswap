import type { GetPoolsArgs } from '@sushiswap/client'

import { SushiSwapProtocol } from 'sushi'
import { AMM_SUPPORTED_CHAIN_IDS } from '../config'

export const PROTOCOL_MAP: Record<SushiSwapProtocol, string> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
} as const

export const AVAILABLE_PROTOCOL_MAP: Partial<typeof PROTOCOL_MAP> = {
  SUSHISWAP_V3: 'SushiSwap V3',
  SUSHISWAP_V2: 'SushiSwap V2',
} as const

// ! Has to be kept up to date with default filters
// Else prefetching won't work
export const defaultPoolsArgs: GetPoolsArgs = {
  chainIds: AMM_SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  protocols: Object.values(SushiSwapProtocol),
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
export const APPROVE_TAG_REMOVE_LEGACY = 'APPROVE_TAG_REMOVE_LEGACY'
export const APPROVE_TAG_STAKE = 'APPROVE_TAG_STAKE'
export const APPROVE_TAG_MIGRATE = 'APPROVE_TAG_MIGRATE'
export const APPROVE_TAG_XSWAP = 'APPROVE_TAG_XSWAP'
export const APPROVE_TAG_SWAP = 'APPROVE_TAG_SWAP'
export const APPROVE_TAG_STEER = 'APPROVE_TAG_STEER'
export const APPROVE_TAG_BONDS = 'APPROVE_TAG_BONDS'
