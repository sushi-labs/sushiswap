import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPersistedConnectorFactories,
  hasPersistedConnector,
  hasPersistedConnectorMatching,
  refreshPersistedConnectorSnapshot,
} from './persisted-connectors'

const privyConnectorId =
  'io.privy.wallet.0x0000000000000000000000000000000000000001'

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
    expect(
      hasPersistedConnectorMatching((id) => id.startsWith('io.privy.wallet.')),
    ).toBe(false)
  })

  it('survives createConfig wiping wagmi.store on the initial setState', async () => {
    const { http, createConfig } = await import('@wagmi/core')
    const { mainnet } = await import('viem/chains')

    installStorage(
      JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [['a', { connector: { id: privyConnectorId } }]],
          },
        },
      }),
    )
    expect(hasPersistedConnector(privyConnectorId)).toBe(true)
    expect(
      hasPersistedConnectorMatching((id) => id.startsWith('io.privy.wallet.')),
    ).toBe(true)

    // Wagmi persists its empty initial state immediately, so a later read of
    // `wagmi.store` sees no connections at all. The snapshot must outlive it.
    createConfig({
      chains: [mainnet],
      multiInjectedProviderDiscovery: false,
      transports: { [mainnet.id]: http() },
      ssr: true,
    })

    expect(window.localStorage.getItem('wagmi.store')).toContain('"value":[]')
    expect(hasPersistedConnector(privyConnectorId)).toBe(true)
  })

  it('does not initialize connectors without persisted intent', () => {
    installStorage(null)
    expect(getPersistedConnectorFactories()).toEqual([])

    installStorage('{')
    expect(getPersistedConnectorFactories()).toEqual([])
  })
})
