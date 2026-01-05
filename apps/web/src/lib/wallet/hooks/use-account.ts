'use client'

import { useWallet } from '../provider'
import type { WalletNamespace } from '../types'

export function useAccount(namespace?: WalletNamespace) {
  const { connections } = useWallet()
  return typeof namespace === 'undefined'
    ? connections[0]
    : connections.find((c) => c.namespace === namespace)
}
