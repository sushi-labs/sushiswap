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

function getPersistedConnectorIds(): ReadonlySet<string> {
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
