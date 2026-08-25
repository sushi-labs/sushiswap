import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPersistedConnectorFactories,
  hasPersistedConnector,
} from './persisted-connectors'

function installStorage(value: string | null): void {
  const values = new Map<string, string>()
  if (value) values.set('wagmi.store', value)
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, nextValue: string) => values.set(key, nextValue),
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('persisted connector factories', () => {
  it('only recreates supported connectors present in Wagmi state', () => {
    installStorage(
      JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [
              ['a', { connector: { id: 'walletConnect' } }],
              ['b', { connector: { id: 'coinbaseWalletSDK' } }],
              ['c', { connector: { id: 'io.metamask' } }],
            ],
          },
        },
      }),
    )

    expect(getPersistedConnectorFactories()).toHaveLength(2)
    expect(hasPersistedConnector('walletConnect')).toBe(true)
    expect(hasPersistedConnector('io.privy')).toBe(false)
  })

  it('does not initialize connectors without persisted intent', () => {
    installStorage(null)
    expect(getPersistedConnectorFactories()).toEqual([])

    installStorage('{')
    expect(getPersistedConnectorFactories()).toEqual([])
  })
})
