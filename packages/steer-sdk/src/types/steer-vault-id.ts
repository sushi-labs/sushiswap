import type { Address, ID } from 'sushi/types'
import type { SteerChainId } from '../constants.js'

export type SteerVaultId = {
  id: ID
  address: Address
  chainId: SteerChainId
}
