'use client'

import { useCallback, useMemo, useState } from 'react'
import { getWalletConfig } from '../config'
import type {
  ConnectOptions,
  WalletConnection,
  WalletNamespace,
} from '../types'
import { loadAdapter } from '../utils/load-adapter'
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

  const connect = useCallback(
    async (walletId: string, opts?: ConnectOptions) => {
      const config = opts?.wallet ?? getWalletConfig(walletId)
      if (!config) {
        throw new Error(`Unknown wallet id: ${walletId}`)
      }

      setError(undefined)
      setPendingWalletId(undefined)

      try {
        const adapter = await loadAdapter(config.adapterId)
        await adapter.connect(opts)

        setConnections((prev) => {
          const next: WalletConnection = {
            id: config.id,
            namespace: config.namespace,
            adapterId: config.adapterId,
            adapter,
          }

          const existingIndex = prev.findIndex((c) => c.id === config.id)
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
    [],
  )

  const disconnect = useCallback(async (walletId: string) => {
    setConnections((prev) => {
      const existing = prev.find((c) => c.id === walletId)
      existing?.adapter.disconnect().catch(() => {})
      return prev.filter((c) => c.id !== walletId)
    })
  }, [])

  const disconnectNamespace = useCallback(
    async (namespace: WalletNamespace) => {
      setConnections((prev) => {
        const toDisconnect = prev.filter((c) => c.namespace === namespace)
        for (const c of toDisconnect) {
          c.adapter.disconnect().catch(() => {})
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
