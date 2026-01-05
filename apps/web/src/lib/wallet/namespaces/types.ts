import type { Wallet } from '../types'

export type WalletNamespaceContext = {
  isConnected: boolean
  account?: string
  connect: (
    wallet: Wallet,
    onSuccess?: (address: string) => void,
  ) => Promise<void>
  disconnect: (wallet?: Wallet) => Promise<void>
}
