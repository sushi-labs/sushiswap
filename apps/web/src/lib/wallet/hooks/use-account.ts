'use client'

import { useWallet } from '../provider'
import type { WalletNamespace } from '../types'

export function useAccount(namespace: WalletNamespace) {
  const { connections } = useWallet()
  return connections.find((c) => c.namespace === namespace)?.adapter
}
