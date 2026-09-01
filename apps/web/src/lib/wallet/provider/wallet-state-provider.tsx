'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { usePrivyEvmReconnectPending } from '../privy/use-privy-runtime'
import type { WalletState } from './types'

const WalletStateContext = createContext<WalletState | null>(null)

export function useWalletState() {
  const ctx = useContext(WalletStateContext)
  if (!ctx) {
    throw new Error('WalletStateProvider is missing')
  }
  return ctx
}

export function WalletStateProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pendingWalletId, setPendingWalletId] = useState<string | undefined>(
    undefined,
  )
  const isPrivyReconnectPending = usePrivyEvmReconnectPending()

  const value = useMemo(
    () => ({
      isPending: Boolean(pendingWalletId) || isPrivyReconnectPending,
      pendingWalletId,
      setPendingWalletId,
    }),
    [isPrivyReconnectPending, pendingWalletId],
  )

  return (
    <WalletStateContext.Provider value={value}>
      {children}
    </WalletStateContext.Provider>
  )
}
