'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRecentWallets } from 'src/lib/wallet/hooks/use-recent-wallets'
import { useConnectors } from 'wagmi'
import type { WalletWithState } from '../../../types'
import { isInjectedConnector } from '../adapters/injected'
import { isSafeAppAvailable } from '../adapters/safe'
import { EVM_WALLETS, EvmAdapterId } from '../config'

export function useEvmWallets() {
  const connectors = useConnectors()
  const { isRecentWallet } = useRecentWallets()

  const injectedConnectors = useMemo(
    () => connectors.filter(isInjectedConnector),
    [connectors],
  )

  const [isSafeAvailable, setIsSafeAvailable] = useState(false)

  // Safe app environment
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const ok = await isSafeAppAvailable()
      if (!cancelled) setIsSafeAvailable(ok)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const connector of injectedConnectors) {
      const walletId = `evm:${connector.id.toLowerCase()}`

      map.set(walletId, {
        id: walletId,
        namespace: 'evm',
        name: connector.name,
        icon: connector.icon ?? '', // TODO: placeholder
        adapterId: EvmAdapterId.Injected,
        isInstalled: true,
        isAvailable: true,
        isRecent: isRecentWallet(walletId),
        uid: connector.uid,
      })
    }

    for (const wallet of EVM_WALLETS) {
      // skip if already added
      if (map.has(wallet.id)) continue

      // always available
      if (
        wallet.adapterId === EvmAdapterId.WalletConnect ||
        wallet.adapterId === EvmAdapterId.Porto ||
        wallet.adapterId === EvmAdapterId.CoinbaseWallet ||
        wallet.adapterId === EvmAdapterId.MetaMask ||
        wallet.id === 'evm:injected'
      ) {
        map.set(wallet.id, {
          ...wallet,
          isInstalled: false,
          isAvailable: true,
          isRecent: isRecentWallet(wallet.id),
        })
        continue
      }

      // safe
      if (wallet.adapterId === EvmAdapterId.Safe) {
        if (isSafeAvailable) {
          map.set(wallet.id, {
            ...wallet,
            isInstalled: true,
            isAvailable: true,
            isRecent: isRecentWallet(wallet.id),
          })
        }
        continue
      }

      // default
      map.set(wallet.id, {
        ...wallet,
        isInstalled: false,
        isAvailable: false,
        isRecent: isRecentWallet(wallet.id),
      })
    }

    return Array.from(map.values())
  }, [injectedConnectors, isSafeAvailable, isRecentWallet])
}
