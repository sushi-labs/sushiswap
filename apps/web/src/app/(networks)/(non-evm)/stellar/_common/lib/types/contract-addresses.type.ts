import type { StellarContractAddress } from 'sushi/stellar'

export type ContractAddresses = {
  FACTORY: StellarContractAddress
  LEGACY_FACTORY?: StellarContractAddress
  ROUTER: StellarContractAddress
  POSITION_MANAGER: StellarContractAddress
  LEGACY_POSITION_MANAGER?: StellarContractAddress
  TOKEN_DESCRIPTOR: StellarContractAddress
  POOL_LENS: StellarContractAddress
  FLASH_EXECUTOR: StellarContractAddress
  ZAP_ROUTER: StellarContractAddress
  POOL_WASM_HASH: string
  TOKENS: {
    XLM: StellarContractAddress
  }
}
