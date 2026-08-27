'use client'

import { useWalletInfo } from '@solana/connector'
import { useMemo } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import {
  PRIVY_SVM_CONNECTOR_ID,
  PRIVY_SVM_WALLET,
  SVM_WALLETS,
  SvmAdapterId,
} from '../config'

function isPrivy(connectorId: string): boolean {
  return connectorId === PRIVY_SVM_CONNECTOR_ID
}

type SvmConnectorWallet = ReturnType<typeof useWalletInfo>['wallets'][number]

export function getSvmWallets({
  wallets,
  isRecentWallet,
}: {
  wallets: readonly SvmConnectorWallet[]
  isRecentWallet(walletId: string): boolean
}): WalletWithState[] {
  const map = new Map<string, WalletWithState>()
  for (const wallet of wallets) {
    const isPrivyWallet = isPrivy(wallet.connectorId)
    const walletId = isPrivyWallet
      ? PRIVY_SVM_WALLET.id
      : `svm:${wallet.name.toLowerCase()}`

    map.set(walletId, {
      id: walletId,
      namespace: 'svm',
      name: isPrivyWallet ? PRIVY_SVM_WALLET.name : wallet.name,
      icon: isPrivyWallet ? PRIVY_SVM_WALLET.icon : (wallet.icon ?? ''),
      adapterId: isPrivyWallet ? SvmAdapterId.Privy : SvmAdapterId.Standard,
      isInstalled: true,
      isAvailable: true,
      isRecent: isRecentWallet(walletId),
    })
  }

  for (const wallet of SVM_WALLETS) {
    if (map.has(wallet.id)) continue

    map.set(wallet.id, {
      ...wallet,
      isInstalled: false,
      isAvailable: wallet.adapterId === SvmAdapterId.Privy,
      isRecent: isRecentWallet(wallet.id),
    })
  }

  return Array.from(map.values())
}

export function useSvmWallets() {
  const { wallets } = useWalletInfo()
  const { isRecentWallet } = useRecentWallets()

  return useMemo(
    () => getSvmWallets({ wallets, isRecentWallet }),
    [wallets, isRecentWallet],
  )
}
