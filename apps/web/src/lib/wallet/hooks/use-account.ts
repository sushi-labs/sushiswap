'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type {
  ChainIdForNamespace,
  WalletConnection,
  WalletNamespace,
} from '../types'

export function useAccount<
  TNamespace extends WalletNamespace = WalletNamespace,
>(namespace?: TNamespace | undefined) {
  const { connections } = useWalletContext()

  return useMemo(() => {
    const connection =
      typeof namespace === 'undefined'
        ? connections[0]
        : connections.find((c) => c.namespace === namespace)

    if (!connection) return undefined

    return (connection as WalletConnection<ChainIdForNamespace<TNamespace>>)
      .account
  }, [connections, namespace])
}
