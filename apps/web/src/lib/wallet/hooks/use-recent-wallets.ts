'use client'

import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useEffect, useMemo } from 'react'

const RECENT_WALLETS_KEY = 'recent-wallets'
const MAX_RECENTS = 5

export function useRecentWallets() {
  const [recentWallets, _setRecentWallets] = useLocalStorage<string[]>(
    RECENT_WALLETS_KEY,
    [],
  )

  useEffect(() => {
    console.log('recentWallets', recentWallets)
  }, [recentWallets])

  const addRecentWallet = useCallback(
    (walletId: string) => {
      _setRecentWallets((prev) => {
        const next = [walletId, ...prev.filter((id) => id !== walletId)]
        return next.slice(0, MAX_RECENTS)
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
