'use client'

import type { Wallet, WalletConnection } from '../types'

export type WalletContext = {
  connections: WalletConnection[]
  isPending: boolean
}

export type WalletState = {
  pendingWalletId: string | undefined
}

export type WalletActions = {
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet: Wallet) => Promise<void>
  disconnectNamespace: (
    namespace: WalletConnection['namespace'],
  ) => Promise<void>
}
