'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useRecentWallets } from '../hooks/use-recent-wallets'
import { getConnections, useConnections, watchConnections } from './store'
import type { WalletContext as WalletContextType } from './types'
import { WalletNamespacesProviders } from './wallet-namespaces-provider'
import { WalletStateProvider, useWalletState } from './wallet-state-provider'

export const WalletContext = createContext<WalletContextType<
  EvmChainId | SvmChainId | StellarChainId
> | null>(null)

export function useWalletContext() {
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
  const { addRecentWallet } = useRecentWallets()

  const value = useMemo(
    () => ({
      connections,
      isConnected: Boolean(connections.length > 0),
      isPending: Boolean(pendingWalletId),
    }),
    [connections, pendingWalletId],
  )

  useEffect(() => {
    return watchConnections(() => {
      const connections = getConnections()

      for (const { id } of connections) {
        addRecentWallet(id)
      }
    })
  }, [addRecentWallet])

  return (
    <WalletContext.Provider value={value}>
      <WalletNamespacesProviders>{children}</WalletNamespacesProviders>
    </WalletContext.Provider>
  )
}
