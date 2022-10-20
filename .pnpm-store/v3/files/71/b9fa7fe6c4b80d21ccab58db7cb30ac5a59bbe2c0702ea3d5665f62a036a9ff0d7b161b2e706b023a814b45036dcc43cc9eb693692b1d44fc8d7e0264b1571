import { IncomingTransfer, ModuleTransaction, MultisigTransaction, Page } from '..'

export type AddressEx = {
  value: string
  name?: string
  logoUri?: string
}

export type FiatCurrencies = string[]

export type OwnedSafes = { safes: string[] }

export enum TokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  NATIVE_TOKEN = 'NATIVE_TOKEN',
}

/**
 * @see https://github.com/safe-global/safe-client-gateway/blob/main/src/common/models/backend/balances.rs
 */
export type TokenInfo = {
  type: TokenType
  address: string
  decimals: number
  symbol: string
  name: string
  logoUri: string
}

export type SafeBalanceResponse = {
  fiatTotal: string
  items: Array<{
    tokenInfo: TokenInfo
    balance: string
    fiatBalance: string
    fiatConversion: string
  }>
}

export type SafeIncomingTransfersResponse = Page<IncomingTransfer>

export type SafeModuleTransactionsResponse = Page<ModuleTransaction>

export type SafeMultisigTransactionsResponse = Page<MultisigTransaction>

export type SafeCollectibleResponse = {
  address: string
  tokenName: string
  tokenSymbol: string
  logoUri: string
  id: string
  uri: string
  name: string
  description: string
  imageUri: string
  metadata: { [key: string]: string }
}
