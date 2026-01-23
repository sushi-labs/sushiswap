'use client'

import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

export function useAccount(namespace?: WalletNamespace) {
  const { connections } = useWalletContext()

  return useMemo(
    () =>
      (typeof namespace === 'undefined'
        ? connections[0]
        : connections.find((c) => c.namespace === namespace)
      )?.account,
    [connections, namespace],
  )
}
