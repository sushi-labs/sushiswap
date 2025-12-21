import { useSyncExternalStore } from 'react'
import type { WalletConnection, WalletNamespace } from '../types'

let connections: WalletConnection[] = []
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

// shallow check
function isWalletConnectionEqual(a: WalletConnection, b: WalletConnection) {
  return (
    a.id === b.id &&
    a.name === b.name &&
    a.namespace === b.namespace &&
    a.account === b.account
  )
}

export function addWalletConnection(connection: WalletConnection) {
  const i = connections.findIndex((x) => x.id === connection.id)

  // add
  if (i === -1) {
    connections = [...connections, connection]
    emit()
    return
  }

  // replace only if changed
  const prev = connections[i]
  if (isWalletConnectionEqual(prev, connection)) return

  const next = connections.slice()
  next[i] = connection
  connections = next
  emit()
}

export function removeWalletConnection(id: string) {
  const i = connections.findIndex((x) => x.id === id)
  if (i === -1) return

  const next = connections.slice()
  next.splice(i, 1)
  connections = next
  emit()
}

export function clearWalletConnections(namespace: WalletNamespace) {
  const next = connections.filter((c) => c.namespace !== namespace)
  if (next.length === connections.length) return
  connections = next
  emit()
}

export function getConnections(): WalletConnection[] {
  return connections
}

export function useConnections(): WalletConnection[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => connections,
    () => connections,
  )
}
