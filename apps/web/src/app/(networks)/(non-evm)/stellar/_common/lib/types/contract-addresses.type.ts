type ContractAddress = string

export type ContractAddresses = {
  FACTORY: ContractAddress
  ROUTER: ContractAddress
  POSITION_MANAGER: ContractAddress
  TOKEN_DESCRIPTOR: ContractAddress
  FLASH_EXECUTOR: ContractAddress
  STRATEGY: ContractAddress
  POOL_WASM_HASH: string
  TOKENS: {
    XLM: ContractAddress
  }
}
