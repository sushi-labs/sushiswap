import type { Address, SushiPoolBase } from 'sushi/types'

export type SushiPositionBase = {
  user: Address
  unstakedBalance: bigint
  pool: Pick<SushiPoolBase, 'id' | 'address' | 'chainId' | 'protocol'>
}
