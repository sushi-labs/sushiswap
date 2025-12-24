'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import { useConnections } from './store'
import type { WalletContext as WalletContextType } from './types'
import { WalletNamespacesProviders } from './wallet-namespaces-provider'
import { WalletStateProvider, useWalletState } from './wallet-state-provider'

export const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('WalletProvider is missing')
  }
  return ctx
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletStateProvider>
      <_WalletProvider>{children}</_WalletProvider>
    </WalletStateProvider>
  )
}

function _WalletProvider({ children }: { children: React.ReactNode }) {
  const connections = useConnections()
  const { pendingWalletId } = useWalletState()

  useEffect(() => {
    console.log('connections', connections)
  }, [connections])

  const value = useMemo(
    () => ({
      connections,
      isPending: Boolean(pendingWalletId),
    }),
    [connections, pendingWalletId],
  )

  return (
    <WalletContext.Provider value={value}>
      <WalletNamespacesProviders>{children}</WalletNamespacesProviders>
    </WalletContext.Provider>
  )
}
