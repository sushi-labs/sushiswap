import type { PoolId } from 'sushi'

export type PoolHasSteerVaults<T extends PoolId = PoolId> = T & {
  hasSteerVaults: boolean
  hadSteerVaults: boolean
}
