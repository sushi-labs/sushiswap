export type WalletNamespace = 'evm' | 'svm' | 'mvm'

export interface WalletAdapterContext {
  uid?: string // evm
  walletName?: string // solana
}

export interface Wallet {
  id: string
  namespace: WalletNamespace
  name: string
  icon: string
  adapterId: string
  url?: string
  uid?: string
}

export interface WalletConnectorConfig {
  recommended: Wallet[]
  other: Wallet[]
  all: Wallet[]
}

export interface WalletWithState extends Wallet {
  installed: boolean
  available: boolean
}

export interface WalletConnection {
  id: string
  name: string
  namespace: WalletNamespace
  account: string
}
