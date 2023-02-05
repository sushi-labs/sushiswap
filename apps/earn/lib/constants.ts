import { GetPoolsArgs } from '@sushiswap/client'
import { Chef } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from '../config'

export const L2_DEADLINE_FROM_NOW = 60 * 5

export const CHEF_TYPE_MAP = {
  MiniChef: Chef.MINICHEF,
  MasterChefV1: Chef.MASTERCHEF,
  MasterChefV2: Chef.MASTERCHEF_V2,
}

export type AvailablePools = 'CONSTANT_PRODUCT_POOL' | 'STABLE_POOL' | 'CONCENTRATED_LIQUIDITY_POOL'

export const GET_POOL_TYPE_MAP: Record<Partial<AvailablePools>, string> = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Liquidity Pool',
  STABLE_POOL: 'Stable Pool',
}

export const AVAILABLE_POOL_TYPE_MAP: Record<string, string> = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  STABLE_POOL: 'Stable Pool',
}

export const defaultPoolsArgs: GetPoolsArgs = {
  chainIds: SUPPORTED_CHAIN_IDS,
  orderBy: 'liquidityUSD',
  orderDir: 'desc',
  poolTypes: Object.keys(AVAILABLE_POOL_TYPE_MAP) as GetPoolsArgs['poolTypes'],
}
