import { Chef } from '@sushiswap/wagmi'

export const L2_DEADLINE_FROM_NOW = 60 * 5

export const CHEF_TYPE_MAP = {
  MiniChef: Chef.MINICHEF,
  MasterChefV1: Chef.MASTERCHEF,
  MasterChefV2: Chef.MASTERCHEF_V2,
}

export const GET_POOL_TYPE_MAP = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  CONCENTRATED_LIQUIDITY_POOL: 'Concentrated Liquidity Pool',
  STABLE_POOL: 'Stable Pool',
}

export const AVAILABLE_POOL_TYPE_MAP = {
  CONSTANT_PRODUCT_POOL: 'Classic Pool',
  STABLE_POOL: 'Stable Pool',
}
