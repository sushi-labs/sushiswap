'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'

const RECENT_WALLETS_KEY = 'recent-wallets'
const MAX_RECENT_WALLETS = 3

export function useRecentWallets() {
  const [recentWallets, _setRecentWallets] = useLocalStorage<string[]>(
    RECENT_WALLETS_KEY,
    [],
  )

  const addRecentWallet = useCallback(
    (walletId: string) => {
      _setRecentWallets((prev) => {
        const next = [walletId, ...prev.filter((id) => id !== walletId)]
        return next.slice(0, MAX_RECENT_WALLETS)
      })
    },
    [_setRecentWallets],
  )

  return useMemo(
    () => ({
      recentWallets,
      isRecentWallet: (walletId: string) => recentWallets.includes(walletId),
      addRecentWallet,
    }),
    [recentWallets, addRecentWallet],
  )
}
