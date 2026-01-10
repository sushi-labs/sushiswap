export type WalletNamespace = 'evm' | 'svm' // | 'mvm'

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
  isInstalled: boolean
  isAvailable: boolean
  isRecent: boolean
}

export interface WalletConnection {
  id: string
  name: string
  namespace: WalletNamespace
  account: string
}

export interface NamespaceContext {
  isConnected: boolean
  account: string | undefined
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet?: Wallet) => Promise<void>
}

export type WalletConnectAction = 'connect' | 'switch' | 'select-namespace'
