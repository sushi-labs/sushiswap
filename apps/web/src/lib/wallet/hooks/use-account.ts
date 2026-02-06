'use client'

import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { SvmChainId } from 'sushi/svm'
import { getNamespaceForChainId } from '../namespaces/namespace-for-chain-id'
import { useWalletContext } from '../provider'
import type { ChainIdForNamespace, WalletNamespace } from '../types'

export function useAccount<TNamespace extends WalletNamespace>(
  namespace?: TNamespace,
): AddressFor<ChainIdForNamespace<TNamespace>> | undefined
export function useAccount<TChainId extends EvmChainId | SvmChainId>(
  chainId: TChainId,
): AddressFor<TChainId> | undefined
export function useAccount(filter?: EvmChainId | SvmChainId | WalletNamespace) {
  const { connections } = useWalletContext()

  const chainId = typeof filter === 'number' ? filter : undefined
  const namespace =
    typeof filter === 'string'
      ? filter
      : chainId
        ? getNamespaceForChainId(chainId)
        : undefined

  return useMemo(() => {
    const connection =
      typeof namespace === 'string'
        ? connections.find((c) => c.namespace === namespace)
        : connections[0]

    if (!connection) return undefined

    return connection.account
  }, [connections, namespace])
}
