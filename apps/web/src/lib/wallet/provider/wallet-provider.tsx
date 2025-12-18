'use client'

import { useCallback, useMemo, useState } from 'react'
import type { Wallet, WalletConnection, WalletNamespace } from '../types'
import { getWalletAdapter } from '../utils/adapter'
import { WalletContext } from './context'

type Props = {
  children: React.ReactNode
}

export function WalletProvider({ children }: Props) {
  const [connections, setConnections] = useState<WalletConnection[]>([])
  const [pendingWalletId, setPendingWalletId] = useState<string | undefined>(
    undefined,
  )
  const [error, setError] = useState<string | undefined>(undefined)

  const connect = useCallback(async (wallet: Wallet) => {
    setError(undefined)
    setPendingWalletId(undefined)

    try {
      const adapter = await getWalletAdapter(wallet)
      await adapter.connect()

      setConnections((prev) => {
        const next: WalletConnection = {
          id: wallet.id,
          namespace: wallet.namespace,
          adapterId: wallet.adapterId,
          adapter,
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
  }, [])

  const disconnect = useCallback(async (wallet: Wallet) => {
    setConnections((prev) => {
      const existing = prev.find((c) => c.id === wallet.id)
      existing?.adapter.disconnect()
      return prev.filter((c) => c.id !== wallet.id)
    })
  }, [])

  const disconnectNamespace = useCallback(
    async (namespace: WalletNamespace) => {
      setConnections((prev) => {
        const toDisconnect = prev.filter((c) => c.namespace === namespace)
        for (const c of toDisconnect) {
          c.adapter.disconnect()
        }
        return prev.filter((c) => c.namespace !== namespace)
      })
    },
    [],
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
