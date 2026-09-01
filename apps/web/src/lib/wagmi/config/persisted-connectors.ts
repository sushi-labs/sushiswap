import {
  type CreateConnectorFn,
  type Storage,
  createStorage,
} from '@wagmi/core'
import { getEvmConnectorFactory } from './connector-factories'

// MetaMask and Coinbase are restored through EIP-6963 discovery. Registering
// their SDK connectors here would make Wagmi dedupe the discovered extensions
// by `rdns`, removing those extension connectors from `useConnectors()`.
const eagerlyRestorableConnectorIds = new Set(['safe', 'walletconnect'])

const browserStorage = {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  removeItem(key: string): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch {}
  },
  setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, value)
    } catch {}
  },
}

/**
 * Recreates non-discoverable connectors before Wagmi hydrates. Connectors
 * created only in response to a click are not part of Wagmi's registry and
 * therefore cannot reconnect after a reload.
 */
export function getPersistedConnectorFactories(): CreateConnectorFn[] {
  const factories = new Set<() => CreateConnectorFn>()
  for (const id of readPersistedConnectorIds()) {
    if (!isEagerlyRestorableConnectorId(id)) continue

    const factory = getEvmConnectorFactory(id)
    if (factory) factories.add(factory)
  }

  return [...factories].map((factory) => factory())
}

export function hasPersistedConnectorMatching(
  predicate: (connectorId: string) => boolean,
): boolean {
  return [...readPersistedConnectorIds()].some(predicate)
}

export function hasRestorablePersistedConnector(): boolean {
  return hasPersistedConnectorMatching(isEagerlyRestorableConnectorId)
}

/**
 * Wagmi's SSR config immediately persists its empty initial state before it
 * hydrates. Preserve an existing connection map through that one write, then
 * delegate every subsequent write to Wagmi as normal.
 */
export function createConnectorRestoringStorage(): Storage {
  let preserveNextStoreWrite = readPersistedConnectorIds().size > 0

  return createStorage({
    storage: {
      ...browserStorage,
      setItem(key, value) {
        if (key === 'wagmi.store' && preserveNextStoreWrite) {
          preserveNextStoreWrite = false
          return
        }
        browserStorage.setItem(key, value)
      },
    },
  })
}

function readPersistedConnectorIds(): ReadonlySet<string> {
  const ids = new Set<string>()

  try {
    const value = browserStorage.getItem('wagmi.store')
    if (!value) return ids

    const parsed: unknown = JSON.parse(value)
    const entries = getPersistedConnectionEntries(parsed)

    for (const entry of entries) {
      if (!Array.isArray(entry) || entry.length !== 2) continue

      const connection = entry[1]
      if (!isRecord(connection)) continue

      const connector = connection.connector
      if (!isRecord(connector) || typeof connector.id !== 'string') continue
      ids.add(connector.id)
    }
  } catch {}

  return ids
}

function getPersistedConnectionEntries(value: unknown): unknown[] {
  if (!isRecord(value) || !isRecord(value.state)) return []

  const connections = value.state.connections
  if (!isRecord(connections) || !Array.isArray(connections.value)) return []

  return connections.value
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isEagerlyRestorableConnectorId(connectorId: string): boolean {
  return eagerlyRestorableConnectorIds.has(connectorId.toLowerCase())
}
