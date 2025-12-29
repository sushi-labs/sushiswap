'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import { SVM_WALLETS, SvmAdapterId } from '../config'

export function useSvmWallets() {
  const { wallets } = useWallet()
  const { isRecentWallet } = useRecentWallets()

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const wallet of wallets) {
      const walletId = `svm:${wallet.adapter.name.toLowerCase()}`

      map.set(walletId, {
        id: walletId,
        namespace: 'svm',
        name: wallet.adapter.name,
        icon: wallet.adapter.icon,
        adapterId: SvmAdapterId.Standard,
        isInstalled: true,
        isAvailable: true,
        isRecent: isRecentWallet(walletId),
      })
    }

    for (const wallet of SVM_WALLETS) {
      // skip if already added
      if (map.has(wallet.id)) continue

      // default
      map.set(wallet.id, {
        ...wallet,
        isInstalled: false,
        isAvailable: false,
        isRecent: isRecentWallet(wallet.id),
      })
    }

    return Array.from(map.values())
  }, [wallets, isRecentWallet])
}
