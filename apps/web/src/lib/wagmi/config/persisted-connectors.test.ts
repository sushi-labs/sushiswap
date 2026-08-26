import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPersistedConnectorFactories,
  hasPersistedConnector,
  refreshPersistedConnectorSnapshot,
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
  refreshPersistedConnectorSnapshot()
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

  it('survives createConfig wiping wagmi.store on the initial setState', async () => {
    const { http, createConfig } = await import('@wagmi/core')
    const { mainnet } = await import('viem/chains')

    installStorage(
      JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [['a', { connector: { id: 'io.privy' } }]],
          },
        },
      }),
    )
    expect(hasPersistedConnector('io.privy')).toBe(true)

    // Wagmi persists its empty initial state immediately, so a later read of
    // `wagmi.store` sees no connections at all. The snapshot must outlive it.
    createConfig({
      chains: [mainnet],
      multiInjectedProviderDiscovery: false,
      transports: { [mainnet.id]: http() },
      ssr: true,
    })

    expect(window.localStorage.getItem('wagmi.store')).toContain('"value":[]')
    expect(hasPersistedConnector('io.privy')).toBe(true)
  })

  it('does not initialize connectors without persisted intent', () => {
    installStorage(null)
    expect(getPersistedConnectorFactories()).toEqual([])

    installStorage('{')
    expect(getPersistedConnectorFactories()).toEqual([])
  })
})
