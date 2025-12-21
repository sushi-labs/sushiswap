'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Wallet, WalletConnection, WalletNamespace } from '../types'
import type { WalletActions, WalletState } from './types'
import {
  WalletActionsProvider,
  useWalletActions,
} from './wallet-actions-provider'

export const WalletContext = createContext<
  (WalletState & WalletActions) | null
>(null)

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) {
    throw new Error('WalletProvider is missing')
  }
  return ctx
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletActionsProvider>
      <_WalletProvider>{children}</_WalletProvider>
    </WalletActionsProvider>
  )
}

function _WalletProvider({ children }: { children: React.ReactNode }) {
  const [connections, setConnections] = useState<WalletConnection[]>([])
  const [pendingWalletId, setPendingWalletId] = useState<string | undefined>(
    undefined,
  )
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    console.log('connections', connections)
  }, [connections])

  const walletActions = useWalletActions()

  const connect = useCallback(
    async (wallet: Wallet) => {
      setError(undefined)
      setPendingWalletId(undefined)

      try {
        await walletActions.connect(wallet)

        setConnections((prev) => {
          const next: WalletConnection = {
            id: wallet.id,
            namespace: wallet.namespace,
            adapterId: wallet.adapterId,
          }

          const existingIndex = prev.findIndex((c) => c.id === wallet.id)
          if (existingIndex !== -1) {
            const copy = prev.slice()
            copy[existingIndex] = next
            return copy
          }

          return [...prev, next]
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to connect wallet.'
        setError(msg)
        console.log('error', e)
        throw e
      } finally {
        setPendingWalletId(undefined)
      }
    },
    [walletActions.connect],
  )

  const disconnect = useCallback(
    async (wallet: Wallet) => {
      await walletActions.disconnect(wallet)
      setConnections((prev) => {
        return prev.filter((c) => c.id !== wallet.id)
      })
    },
    [walletActions.disconnect],
  )

  const disconnectNamespace = useCallback(
    async (namespace: WalletNamespace) => {
      await walletActions.disconnectNamespace(namespace)
      setConnections((prev) => {
        return prev.filter((c) => c.namespace !== namespace)
      })
    },
    [walletActions.disconnectNamespace],
  )

  const value = useMemo(
    () => ({
      connections,
      pending: Boolean(pendingWalletId),
      error,
      connect,
      disconnect,
      disconnectNamespace,
    }),
    [
      connections,
      pendingWalletId,
      error,
      connect,
      disconnect,
      disconnectNamespace,
    ],
  )

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}
