import type { AdapterId } from './config'

export type WalletNamespace = 'eip155' | 'solana' | 'aptos'

export interface WalletAdapter {
  namespace: WalletNamespace
  name?: string

  isConnected(): boolean
  getAddress(): string | undefined

  connect(): Promise<void>
  disconnect(): Promise<void>
}

export interface WalletAdapterContext {
  uid?: string
}

export interface Wallet {
  id: string
  namespace: WalletNamespace
  name: string
  icon: string
  adapterId: AdapterId
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
  namespace: WalletNamespace
  adapterId: AdapterId
  adapter: WalletAdapter
}
