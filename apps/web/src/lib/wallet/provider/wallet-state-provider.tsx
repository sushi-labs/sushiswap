import { createContext, useContext, useMemo, useState } from 'react'
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

  const value = useMemo(
    () => ({
      pendingWalletId,
      setPendingWalletId,
    }),
    [pendingWalletId],
  )

  return (
    <WalletStateContext.Provider value={value}>
      {children}
    </WalletStateContext.Provider>
  )
}
