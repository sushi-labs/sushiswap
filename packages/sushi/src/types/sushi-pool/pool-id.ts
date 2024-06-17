import type { ChainId } from 'sushi/chain'
import type { Address, ID, SushiSwapProtocol } from 'sushi/types'

export type PoolId = {
  id: ID
  address: Address
  chainId: ChainId

  protocol: SushiSwapProtocol
}
