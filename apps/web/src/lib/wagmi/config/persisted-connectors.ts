import type { CreateConnectorFn } from '@wagmi/core'
import { evmConnectorFactories } from './connector-factories'

type PersistedConnection = {
  connector?: {
    id?: unknown
  }
}

type PersistedWagmiStore = {
  state?: {
    connections?: {
      __type?: unknown
      value?: unknown
    }
  }
}

/**
 * Recreates non-discoverable connectors before Wagmi hydrates. Connectors
 * created only in response to a click are not part of Wagmi's registry and
 * therefore cannot reconnect after a reload.
 */
export function getPersistedConnectorFactories(): CreateConnectorFn[] {
  return Array.from(getPersistedConnectorIds()).flatMap((id) => {
    const factory = evmConnectorFactories[id]
    return factory ? [factory()] : []
  })
}

export function hasPersistedConnector(connectorId: string): boolean {
  return getPersistedConnectorIds().has(connectorId.toLowerCase())
}

export function hasPersistedConnectorMatching(
  predicate: (connectorId: string) => boolean,
): boolean {
  return [...getPersistedConnectorIds()].some(predicate)
}

/**
 * Snapshotted at module evaluation. `createConfig()` overwrites `wagmi.store`
 * with an empty state as soon as it runs (Zustand's persist middleware writes
 * on the initial `setState`, and `skipHydration` is on for SSR), so any read
 * that happens later - e.g. from a React effect - sees no connections at all.
 * This module is a leaf of the Wagmi config graph, so it is evaluated before
 * that happens.
 */
let persistedConnectorIds: ReadonlySet<string> = readPersistedConnectorIds()

/** Test-only: re-reads the snapshot after stubbing `window.localStorage`. */
export function refreshPersistedConnectorSnapshot(): void {
  persistedConnectorIds = readPersistedConnectorIds()
}

function getPersistedConnectorIds(): ReadonlySet<string> {
  return persistedConnectorIds
}

function readPersistedConnectorIds(): ReadonlySet<string> {
  if (typeof window === 'undefined') return new Set()

  try {
    const value = window.localStorage.getItem('wagmi.store')
    if (!value) return new Set()

    const parsed = JSON.parse(value) as PersistedWagmiStore
    const entries = parsed.state?.connections?.value
    if (!Array.isArray(entries)) return new Set()

    const ids = new Set<string>()
    for (const entry of entries) {
      if (!Array.isArray(entry) || entry.length !== 2) continue
      const connection = entry[1] as PersistedConnection
      if (typeof connection.connector?.id !== 'string') continue
      ids.add(connection.connector.id.toLowerCase())
    }

    return ids
  } catch {
    return new Set()
  }
}
