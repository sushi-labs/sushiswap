import { useMemo } from 'react'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

export const useWallet = (namespace?: WalletNamespace) => {
  const { connections } = useWalletContext()

  return useMemo(
    () =>
      typeof namespace === 'undefined'
        ? connections[0]
        : connections.find((c) => c.namespace === namespace),
    [connections, namespace],
  )
}
