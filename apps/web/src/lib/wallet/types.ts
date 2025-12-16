export type WalletNamespace = 'eip155' | 'solana' | 'aptos'

export interface UnifiedWalletAdapter {
  namespace: WalletNamespace
  name?: string

  isConnected(): boolean
  getAddress(): string | undefined

  connect(opts?: ConnectOptions): Promise<void>
  disconnect(): Promise<void>
}

export interface WalletConfig {
  id: string
  namespace: WalletNamespace
  name: string
  icon: string
  adapterId: string
  url?: string
}

export interface WalletConnectorConfig {
  recommended: WalletConfig[]
  other: WalletConfig[]
  all: WalletConfig[]
}

export interface WalletWithState extends WalletConfig {
  installed: boolean
  available: boolean
}

export interface WalletConnection {
  id: string
  namespace: WalletNamespace
  adapterId: string
  adapter: UnifiedWalletAdapter
}

export interface ConnectOptions {
  wallet?: WalletConfig & {
    uid?: string
  }
}
