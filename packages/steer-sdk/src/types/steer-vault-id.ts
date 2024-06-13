import type { Address, ID } from 'sushi/types'
import type { SteerChainId } from '../constants'

export type SteerVaultId = {
  id: ID
  address: Address
  chainId: SteerChainId
}
