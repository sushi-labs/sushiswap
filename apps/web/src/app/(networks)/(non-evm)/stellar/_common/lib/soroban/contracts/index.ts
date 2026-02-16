import { IS_FUTURENET } from '../../constants'
import type { ContractAddresses } from '../../types/contract-addresses.type'
import { CONTRACT_ADDRESSES as FUTURENET_CONTRACT_ADDRESSES } from './futurenet/contract-addresses'
import { CONTRACT_ADDRESSES as MAINNET_CONTRACT_ADDRESSES } from './mainnet/contract-addresses'

export const contractAddresses: ContractAddresses = IS_FUTURENET
  ? FUTURENET_CONTRACT_ADDRESSES
  : MAINNET_CONTRACT_ADDRESSES
