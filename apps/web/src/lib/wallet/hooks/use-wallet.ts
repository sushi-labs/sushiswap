import { useMemo } from 'react'
import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useWalletContext } from '../provider'
import type {
  ChainIdForNamespace,
  WalletConnection,
  WalletNamespace,
} from '../types'

export function useWallet<TNamespace extends WalletNamespace>(
  namespace?: TNamespace,
): WalletConnection<ChainIdForNamespace<TNamespace>> | undefined
export function useWallet<
  TChainId extends EvmChainId | SvmChainId | StellarChainId,
>(chainId: TChainId): WalletConnection<TChainId> | undefined
export function useWallet(
  filter?: EvmChainId | SvmChainId | StellarChainId | WalletNamespace,
) {
  const { connections } = useWalletContext()

  const namespace = typeof filter === 'string' ? filter : undefined
  const chainId = typeof filter === 'number' ? filter : undefined

  return useMemo(() => {
    const connection =
      typeof chainId === 'number'
        ? connections.find((c) => c.chainId === chainId)
        : typeof namespace === 'string'
          ? connections.find((c) => c.namespace === namespace)
          : connections[0]

    if (!connection) return undefined

    return connection
  }, [connections, chainId, namespace])
}
