import type { Address, PoolId } from 'sushi/types'

export type SushiPositionBase = {
  user: Address
  unstakedBalance: bigint
  pool: PoolId
}
