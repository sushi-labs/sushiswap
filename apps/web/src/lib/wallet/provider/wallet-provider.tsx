'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { ENABLED_WALLET_NAMESPACES } from '../config'
import { useRecentWallets } from '../hooks/use-recent-wallets'
import type { WalletNamespace } from '../types'
import { getConnections, useConnections, watchConnections } from './store'
import type { WalletContext as WalletContextType } from './types'
import { WalletNamespacesProviders } from './wallet-namespaces-provider'
import { WalletStateProvider, useWalletState } from './wallet-state-provider'

export const WalletContext = createContext<WalletContextType<
  EvmChainId | SvmChainId | StellarChainId
> | null>(null)

const WalletRestorationContext = createContext<
  (namespace: WalletNamespace) => void
>(() => undefined)

export function useWalletContext() {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('WalletProvider is missing')
  }
  return ctx
}

export function useMarkWalletNamespaceRestored() {
  return useContext(WalletRestorationContext)
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
  const [restoringNamespaces, setRestoringNamespaces] = useState<
    WalletNamespace[]
  >(() => [...ENABLED_WALLET_NAMESPACES])
  const { pendingWalletId } = useWalletState()
  const { addRecentWallet } = useRecentWallets()
  const markNamespaceRestored = useCallback((namespace: WalletNamespace) => {
    setRestoringNamespaces((current) =>
      current.includes(namespace)
        ? current.filter((item) => item !== namespace)
        : current,
    )
  }, [])

  const value = useMemo(
    () => ({
      connections,
      isConnected: Boolean(connections.length > 0),
      isPending: Boolean(pendingWalletId),
      isRestoring: restoringNamespaces.length > 0,
      restoringNamespaces,
    }),
    [connections, pendingWalletId, restoringNamespaces],
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
      <WalletRestorationContext.Provider value={markNamespaceRestored}>
        <WalletNamespacesProviders>{children}</WalletNamespacesProviders>
      </WalletRestorationContext.Provider>
    </WalletContext.Provider>
  )
}
