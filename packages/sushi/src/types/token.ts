import type { ChainId } from 'sushi/chain'
import type { Address, ID } from 'sushi/types'

export type Token = {
  id: ID
  address: Address
  chainId: ChainId
  name: string
  symbol: string
  decimals: number
}
