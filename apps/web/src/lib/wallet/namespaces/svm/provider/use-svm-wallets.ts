'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useMemo } from 'react'
import type { WalletWithState } from '../../../types'
import { SvmAdapterId, SvmWalletConfig } from '../config'

export function useSvmWallets() {
  const { wallets } = useWallet()

  useEffect(() => {
    console.log('svm-wallets', wallets)
  }, [wallets])

  return useMemo(() => {
    const map = new Map<string, WalletWithState>()
    for (const wallet of wallets) {
      const walletId = `svm-${wallet.adapter.name.toLowerCase()}`

      map.set(walletId, {
        id: walletId,
        namespace: 'evm',
        name: wallet.adapter.name,
        icon: wallet.adapter.icon,
        adapterId: SvmAdapterId.Standard,
        installed: true,
        available: true,
      })
    }

    for (const wallet of SvmWalletConfig.all) {
      // skip if already added by detection (installed injected)
      if (map.has(wallet.id)) continue

      // default
      map.set(wallet.id, { ...wallet, installed: false, available: false })
    }

    return Array.from(map.values())
  }, [wallets])
}
