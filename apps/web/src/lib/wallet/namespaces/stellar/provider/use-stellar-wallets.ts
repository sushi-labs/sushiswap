'use client'

import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import { useEffect, useMemo, useState } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import {
  StellarAdapterId,
  getStellarWalletId,
  stellarWalletKit,
} from '../config'

export function useStellarWallets() {
  const [wallets, setWallets] = useState<ISupportedWallet[]>([])
  const { isRecentWallet } = useRecentWallets()

  useEffect(() => {
    async function fetchWallets() {
      const supportedWallets = await stellarWalletKit.refreshSupportedWallets()
      setWallets(supportedWallets)
    }

    fetchWallets()
  }, [])

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const wallet of wallets) {
      const walletId = getStellarWalletId(wallet.id)

      map.set(walletId, {
        id: walletId,
        namespace: 'stellar',
        name: wallet.name,
        icon: wallet.icon ?? '',
        adapterId: StellarAdapterId.Standard,
        isInstalled: wallet.isAvailable, //come back to this
        isAvailable: wallet.isAvailable,
        isRecent: isRecentWallet(walletId),
        url: wallet.url,
      })
    }

    return Array.from(map.values())
  }, [isRecentWallet, wallets])
}
