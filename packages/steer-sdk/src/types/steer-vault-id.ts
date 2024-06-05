import type { SushiSwapV3ChainId } from 'sushi/config'
import type { Address, ID } from 'sushi/types'

export type SteerVaultId = {
  id: ID
  address: Address
  chainId: SushiSwapV3ChainId
}
