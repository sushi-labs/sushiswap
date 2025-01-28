import type { PoolId } from 'sushi/types'
import type { SteerVaultId } from './steer-vault-id.js'

export type SteerVaultWithPool<
  Vault extends SteerVaultId = SteerVaultId,
  Pool extends PoolId = PoolId,
> = Omit<Vault, 'pool'> & {
  pool: Pool
}
