import type { PoolId } from 'sushi/types'
import type { SteerVaultId } from './steer-vault-id'

export type SteerVaultWithPool<
  Vault extends SteerVaultId = SteerVaultId,
  Pool extends PoolId = PoolId,
> = Omit<Vault, 'pool'> & {
  pool: Pool
}
