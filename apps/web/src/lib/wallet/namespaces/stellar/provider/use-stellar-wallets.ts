'use client'

import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import { useEffect, useMemo, useState } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import { StellarAdapterId, stellarWalletKit } from '../config'

const _useStellarWallets = () => {
  const [wallets, setWallets] = useState<ISupportedWallet[]>([])

  useEffect(() => {
    const fetchWallets = async () => {
      const supportedWallets = await stellarWalletKit.getSupportedWallets()
      setWallets(supportedWallets)
    }

    fetchWallets()
  }, [])

  return { wallets }
}

export function useStellarWallets() {
  const { isRecentWallet } = useRecentWallets()
  const { wallets } = _useStellarWallets()

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const wallet of wallets) {
      const walletId = `stellar:${wallet.id.toLowerCase()}`

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
