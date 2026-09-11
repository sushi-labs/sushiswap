import { useSyncExternalStore } from 'react'
import type { WalletConnection, WalletNamespace } from '../types'

let connections: WalletConnection[] = []
const shouldTrackWalletRestoration = process.env.NEXT_PUBLIC_APP_ENV !== 'test'
let isRestoringByNamespace: Record<WalletNamespace, boolean> = {
  evm: shouldTrackWalletRestoration,
  svm: shouldTrackWalletRestoration,
  stellar: false,
}
// Restoration only covers the initial provider hydration. Once a namespace
// settles, delayed provider status changes must not put the UI back into its
// startup loading state.
const hasFinishedRestoringByNamespace: Record<WalletNamespace, boolean> = {
  evm: !shouldTrackWalletRestoration,
  svm: !shouldTrackWalletRestoration,
  stellar: true,
}
const connectionListeners = new Set<() => void>()
const restorationListeners = new Set<() => void>()

function emit(listeners: Set<() => void>) {
  for (const listener of listeners) listener()
}

// shallow check
function isWalletConnectionEqual(a: WalletConnection, b: WalletConnection) {
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.namespace === b.namespace &&
    a.account === b.account &&
    a.chainId === b.chainId &&
    a.icon === b.icon
  )
}

export function addWalletConnection(connection: WalletConnection) {
  const i = connections.findIndex((x) => x.id === connection.id)

  // add new connection
  if (i === -1) {
    connections = [...connections, connection]
    emit(connectionListeners)
    return
  }

  // replace only if changed
  const prev = connections[i]
  if (isWalletConnectionEqual(prev, connection)) return

  const next = connections.slice()
  next[i] = connection
  connections = next
  emit(connectionListeners)
}

/** Replace the active connection for namespaces that only support one wallet. */
export function setActiveWalletConnection(connection: WalletConnection) {
  const namespaceConnections = connections.filter(
    (candidate) => candidate.namespace === connection.namespace,
  )
  if (
    namespaceConnections.length === 1 &&
    isWalletConnectionEqual(namespaceConnections[0], connection)
  ) {
    return
  }

  connections = [
    ...connections.filter(
      (candidate) => candidate.namespace !== connection.namespace,
    ),
    connection,
  ]
  emit(connectionListeners)
}

export function removeWalletConnection(id: string) {
  const i = connections.findIndex((x) => x.id === id)
  if (i === -1) return

  const next = connections.slice()
  next.splice(i, 1)
  connections = next
  emit(connectionListeners)
}

export function clearWalletConnections(namespace: WalletNamespace) {
  const next = connections.filter((c) => c.namespace !== namespace)
  if (next.length === connections.length) return
  connections = next
  emit(connectionListeners)
}

export function getConnections(): WalletConnection[] {
  return connections
}

export function setWalletNamespaceRestoring(
  namespace: WalletNamespace,
  isRestoring: boolean,
) {
  if (hasFinishedRestoringByNamespace[namespace]) return

  const nextIsRestoring = shouldTrackWalletRestoration && isRestoring

  if (!nextIsRestoring) {
    hasFinishedRestoringByNamespace[namespace] = true
  }

  if (isRestoringByNamespace[namespace] === nextIsRestoring) return

  isRestoringByNamespace = {
    ...isRestoringByNamespace,
    [namespace]: nextIsRestoring,
  }
  emit(restorationListeners)
}

export function watchConnections(listener: () => void) {
  connectionListeners.add(listener)

  return () => {
    connectionListeners.delete(listener)
  }
}

export function useConnections(): WalletConnection[] {
  return useSyncExternalStore(
    (cb) => {
      connectionListeners.add(cb)
      return () => connectionListeners.delete(cb)
    },
    () => connections,
    () => connections,
  )
}

export function useWalletRestorationState(): Record<WalletNamespace, boolean> {
  return useSyncExternalStore(
    (cb) => {
      restorationListeners.add(cb)
      return () => restorationListeners.delete(cb)
    },
    () => isRestoringByNamespace,
    () => isRestoringByNamespace,
  )
}
