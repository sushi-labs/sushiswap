'use client'

import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import { useEffect, useMemo, useState } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import type { WalletWithState } from '../../../types'
import {
  StellarAdapterId,
  getStellarWalletId,
  getStellarWalletKit,
} from '../config'

const EMPTY_WALLETS: WalletWithState[] = []

export function useStellarWallets(): WalletWithState[] {
  return useStellarWalletDiscovery() ?? EMPTY_WALLETS
}

export function useStellarWalletDiscovery(): WalletWithState[] | undefined {
  // Keep discovery pending distinct from a completed, empty wallet list.
  const [wallets, setWallets] = useState<ISupportedWallet[]>()
  const { isRecentWallet } = useRecentWallets()

  useEffect(() => {
    let cancelled = false

    async function fetchWallets() {
      try {
        const kit = await getStellarWalletKit()
        const supportedWallets = await kit.refreshSupportedWallets()
        if (!cancelled) setWallets(supportedWallets)
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load Stellar wallets', error)
          setWallets([])
        }
      }
    }

    fetchWallets()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    if (wallets === undefined) return undefined

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
