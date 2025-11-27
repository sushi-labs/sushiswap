/**
 * Contract addresses for Stellar/Soroban DEX contracts
 * Using deployed contract addresses from latest deployment
 */

import type { ContractAddresses } from '~stellar/_common/lib/types/contract-addresses.type'

export const CONTRACT_ADDRESSES: ContractAddresses = {
  // Core DEX contracts
  FACTORY: '',
  ROUTER: '',
  POSITION_MANAGER: '',
  TOKEN_DESCRIPTOR: '',
  FLASH_EXECUTOR: '',
  STRATEGY: '',
  POOL_WASM_HASH: '',

  // Tokens
  TOKENS: {
    XLM: 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', // native XLM token
  },
}
