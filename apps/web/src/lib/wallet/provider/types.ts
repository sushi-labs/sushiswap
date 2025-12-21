'use client'

import type { Wallet, WalletConnection } from '../types'

export type WalletState = {
  connections: WalletConnection[]
  pending: boolean
  error: string | undefined
}

export type WalletActions = {
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet: Wallet) => Promise<void>
  disconnectNamespace: (
    namespace: WalletConnection['namespace'],
  ) => Promise<void>
}
