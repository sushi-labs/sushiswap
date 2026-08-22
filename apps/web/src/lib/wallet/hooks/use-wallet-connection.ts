'use client'

import type { EvmChainId } from 'sushi/evm'
import type { StellarChainId } from 'sushi/stellar'
import type { SvmChainId } from 'sushi/svm'
import { useWalletContext } from '../provider'
import { useWalletRestorationState } from '../provider/store'
import { useWalletState } from '../provider/wallet-state-provider'
import type {
  ChainIdForNamespace,
  WalletConnection,
  WalletNamespace,
} from '../types'

type WalletChainId = EvmChainId | SvmChainId | StellarChainId

export type WalletConnectionStatus =
  | 'restoring'
  | 'connecting'
  | 'connected'
  | 'disconnected'

export type UseWalletConnectionReturnType<TChainId extends WalletChainId> = {
  address: WalletConnection<TChainId>['account'] | undefined
  connection: WalletConnection<TChainId> | undefined
  isConnected: boolean
  isPending: boolean
  isRestoring: boolean
  status: WalletConnectionStatus
}

export function useWalletConnection<TNamespace extends WalletNamespace>(
  namespace: TNamespace,
): UseWalletConnectionReturnType<ChainIdForNamespace<TNamespace>>
export function useWalletConnection(
  namespace?: WalletNamespace,
): UseWalletConnectionReturnType<WalletChainId>
export function useWalletConnection(
  namespace?: WalletNamespace,
): UseWalletConnectionReturnType<WalletChainId> {
  const { connections } = useWalletContext()
  const { pendingWalletId } = useWalletState()
  const isRestoringByNamespace = useWalletRestorationState()
  const connection = namespace
    ? connections.find((connection) => connection.namespace === namespace)
    : connections[0]
  const isNamespaceRestoring = namespace
    ? isRestoringByNamespace[namespace]
    : Object.values(isRestoringByNamespace).some(Boolean)
  const isConnected = Boolean(connection)
  const isPending = namespace
    ? pendingWalletId?.startsWith(`${namespace}:`) === true
    : Boolean(pendingWalletId)
  const status = getWalletConnectionStatus({
    isConnected,
    isPending,
    isRestoring: isNamespaceRestoring,
  })

  return {
    address: connection?.account,
    connection,
    isConnected,
    isPending,
    isRestoring: isNamespaceRestoring,
    status,
  }
}

function getWalletConnectionStatus({
  isConnected,
  isPending,
  isRestoring,
}: {
  isConnected: boolean
  isPending: boolean
  isRestoring: boolean
}): WalletConnectionStatus {
  if (isPending) return 'connecting'
  if (isConnected) return 'connected'
  if (isRestoring) return 'restoring'
  return 'disconnected'
}
