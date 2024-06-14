import type { PoolId } from 'sushi'

type PoolHasSteerVaultsRequired = {
  hasEnabledSteerVault: boolean
  hadEnabledSteerVault: boolean
}

type PoolHasSteerVaultsOptional =
  | PoolHasSteerVaultsRequired
  | {
      hasEnabledSteerVault?: undefined
      hadEnabledSteerVault?: undefined
    }

export type PoolHasSteerVaults<
  T extends PoolId = PoolId,
  Optional extends boolean = false,
> = T &
  (Optional extends true
    ? PoolHasSteerVaultsOptional
    : PoolHasSteerVaultsRequired)
