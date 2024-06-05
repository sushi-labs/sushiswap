import type { PoolId } from 'sushi'

export type PoolHasSteerVaults<T extends PoolId = PoolId> = T & {
  hasEnabledSteerVault: boolean
  hadEnabledSteerVault: boolean
}
