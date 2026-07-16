'use client'

import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { getNamespaceForChainId } from '../namespaces/namespace-for-chain-id'
import { useWalletContext } from '../provider'
import type { WalletNamespace } from '../types'

export function useIsWalletRestoring(
  filter?: EvmChainId | SvmChainId | StellarChainId | WalletNamespace,
): boolean {
  const { isRestoring, restoringNamespaces } = useWalletContext()

  if (filter === undefined) return isRestoring

  const namespace =
    typeof filter === 'string' ? filter : getNamespaceForChainId(filter)

  return restoringNamespaces.includes(namespace)
}
