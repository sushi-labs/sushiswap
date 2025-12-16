'use client'

import { createContext } from 'react'
import type { ConnectOptions, WalletConnection } from '../types'

export type WalletState = {
  connections: WalletConnection[]
  pending: boolean
  error: string | undefined
}

export type WalletActions = {
  connect: (walletId: string, opts?: ConnectOptions) => Promise<void>
  disconnect: (walletId: string) => Promise<void>
  disconnectNamespace: (
    namespace: WalletConnection['namespace'],
  ) => Promise<void>
}

export type WalletContextValue = WalletState & WalletActions

export const WalletContext = createContext<WalletContextValue | null>(null)
