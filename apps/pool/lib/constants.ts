import { Chef } from '@sushiswap/wagmi'

export const L2_DEADLINE_FROM_NOW = 60 * 5

export const CHEF_TYPE_MAP = {
  MiniChef: Chef.MINICHEF,
  MasterChef: Chef.MASTERCHEF,
  MasterChefV2: Chef.MASTERCHEF_V2,
}
