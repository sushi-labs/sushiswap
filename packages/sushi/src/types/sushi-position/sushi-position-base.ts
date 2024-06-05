import type { Address, PoolBase } from 'sushi/types'

export type SushiPositionBase = {
  user: Address
  unstakedBalance: bigint
  pool: Pick<PoolBase, 'id' | 'address' | 'chainId' | 'protocol'>
}
