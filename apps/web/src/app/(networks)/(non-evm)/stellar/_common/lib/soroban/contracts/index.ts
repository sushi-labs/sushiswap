import { IS_TESTNET } from '../../constants'
import type { ContractAddresses } from '../../types/contract-addresses.type'
import { CONTRACT_ADDRESSES as MAINNET_CONTRACT_ADDRESSES } from './mainnet/contract-addresses'
import { CONTRACT_ADDRESSES as TESTNET_CONTRACT_ADDRESSES } from './testnet/contract-addresses'

export const contractAddresses: ContractAddresses = IS_TESTNET
  ? TESTNET_CONTRACT_ADDRESSES
  : MAINNET_CONTRACT_ADDRESSES
