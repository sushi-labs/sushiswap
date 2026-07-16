'use client'

import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import type { Wallet, WalletConnection } from '../types'
import type { WalletNamespace } from '../types'

export type WalletContext<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> = {
  connections: WalletConnection<TChainId>[]
  isPending: boolean
  isConnected: boolean
  isRestoring: boolean
  restoringNamespaces: WalletNamespace[]
}

export type WalletState = {
  pendingWalletId: string | undefined
  setPendingWalletId: (walletId: string | undefined) => void
}

export type WalletActions<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
> = {
  connect: (wallet: Wallet) => Promise<void>
  disconnect: (wallet: Wallet) => Promise<void>
  disconnectNamespace: (
    namespace: WalletConnection<TChainId>['namespace'],
  ) => Promise<void>
}
