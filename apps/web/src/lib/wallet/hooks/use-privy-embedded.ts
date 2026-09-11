'use client'

import type { PrivyEvmWallet, PrivySvmWallet } from 'src/lib/wallet/privy/types'
import { usePrivyRuntime } from 'src/lib/wallet/privy/use-privy-runtime'

type Namespace = 'evm' | 'svm'

export function usePrivyEmbeddedWallet(
  namespace: 'evm',
): PrivyEvmWallet | undefined

export function usePrivyEmbeddedWallet(
  namespace: 'svm',
): PrivySvmWallet | undefined

export function usePrivyEmbeddedWallet(
  namespace: Namespace,
): PrivyEvmWallet | PrivySvmWallet | undefined {
  const snapshot = usePrivyRuntime()
  return namespace === 'svm'
    ? (snapshot.svmWallet ?? undefined)
    : (snapshot.evmWallet ?? undefined)
}
