type ContractAddress = string

export type ContractAddresses = {
  FACTORY: ContractAddress
  ROUTER: ContractAddress
  POSITION_MANAGER: ContractAddress
  TOKEN_DESCRIPTOR: ContractAddress
  POOL_LENS: ContractAddress
  FLASH_EXECUTOR: ContractAddress
  ZAP_ROUTER: ContractAddress
  POOL_WASM_HASH: string
  TOKENS: {
    XLM: ContractAddress
  }
}
