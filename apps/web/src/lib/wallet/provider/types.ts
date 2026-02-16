'use client'

import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import type { Wallet, WalletConnection } from '../types'

export type WalletContext<TChainId extends EvmChainId | SvmChainId> = {
  connections: WalletConnection<TChainId>[]
  isPending: boolean
  isConnected: boolean
}

export type WalletState = {
  pendingWalletId: string | undefined
  setPendingWalletId: (walletId: string | undefined) => void
}

export type WalletActions<TChainId extends EvmChainId | SvmChainId> = {
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet: Wallet) => Promise<void>
  disconnectNamespace: (
    namespace: WalletConnection<TChainId>['namespace'],
  ) => Promise<void>
}
