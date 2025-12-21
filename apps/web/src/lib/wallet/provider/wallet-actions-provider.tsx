'use client'

import type React from 'react'
import { createContext, useCallback, useContext, useMemo } from 'react'
import {
  EvmWalletProvider,
  useEvmWalletContext,
} from '../namespaces/evm/provider/evm-wallet-provider'
import {
  SvmWalletProvider,
  useSvmWalletContext,
} from '../namespaces/svm/provider/svm-wallet-provider'
import type { Wallet, WalletNamespace } from '../types'
import type { WalletActions } from './types'

const WalletActionsContext = createContext<WalletActions | null>(null)

export function useWalletActions() {
  const ctx = useContext(WalletActionsContext)
  if (!ctx)
    throw new Error(
      'useWalletActions must be used within <WalletActionsProvider>',
    )
  return ctx
}

const namespaceProviders = [EvmWalletProvider, SvmWalletProvider]

function NamespaceProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return namespaceProviders.reduceRight(
    (acc, Provider) => <Provider key={Provider.name}>{acc}</Provider>,
    children,
  )
}

export function WalletActionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NamespaceProviders>
      <_WalletActionsProvider>{children}</_WalletActionsProvider>
    </NamespaceProviders>
  )
}

function _WalletActionsProvider({ children }: { children: React.ReactNode }) {
  const evm = useEvmWalletContext()
  const svm = useSvmWalletContext()

  const selectNamespace = useCallback(
    (namespace: WalletNamespace) => {
      switch (namespace) {
        case 'evm':
          return evm
        case 'svm':
          return svm
        // case 'mvm':
        //     return undefined
        default:
          throw new Error(`Unknown namespace: ${namespace}`)
      }
    },
    [evm, svm],
  )

  const connect = useCallback(
    async (wallet: Wallet) => {
      return selectNamespace(wallet.namespace).connect(wallet)
    },
    [selectNamespace],
  )

  const disconnect = useCallback(
    async (wallet: Wallet) => {
      return selectNamespace(wallet.namespace).disconnect(wallet)
    },
    [selectNamespace],
  )

  const disconnectNamespace = useCallback(
    async (namespace: WalletNamespace) => {
      return selectNamespace(namespace)?.disconnect()
    },
    [selectNamespace],
  )

  const value = useMemo<WalletActions>(
    () => ({
      connect,
      disconnect,
      disconnectNamespace,
    }),
    [connect, disconnect, disconnectNamespace],
  )

  return (
    <WalletActionsContext.Provider value={value}>
      {children}
    </WalletActionsContext.Provider>
  )
}
