import type { PoolId } from 'sushi/types'
import type { PoolHasSteerVaults } from './pool-has-steer-vaults.js'
import type { SteerVaultId } from './steer-vault-id.js'

export type PoolWithSteerVaults<
  Pool extends PoolId = PoolId,
  Vault extends SteerVaultId = SteerVaultId,
> = PoolHasSteerVaults<Pool> & {
  steerVaults: Vault[]
}
