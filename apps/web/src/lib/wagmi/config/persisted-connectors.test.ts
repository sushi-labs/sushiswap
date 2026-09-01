import { afterEach, describe, expect, it, vi } from 'vitest'

const privyConnectorId =
  'io.privy.wallet.0xAbCd000000000000000000000000000000000001'

type StorageValues = {
  recentConnectorId?: string
  store?: string
}

async function loadWithStorage({
  recentConnectorId,
  store,
}: StorageValues = {}) {
  const values = new Map<string, string>()
  if (recentConnectorId) {
    values.set('wagmi.recentConnectorId', JSON.stringify(recentConnectorId))
  }
  if (store) values.set('wagmi.store', store)

  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      removeItem: (key: string) => values.delete(key),
      setItem: (key: string, value: string) => values.set(key, value),
    },
  })
  vi.resetModules()

  return {
    module: await import('./persisted-connectors'),
    values,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('persisted connector factories', () => {
  it('only recreates supported non-discoverable connectors', async () => {
    const { module } = await loadWithStorage({
      store: JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [
              ['a', { connector: { id: 'walletConnect' } }],
              ['b', { connector: { id: 'safe' } }],
              ['c', { connector: { id: 'metaMaskSDK' } }],
              ['d', { connector: { id: 'coinbaseWalletSDK' } }],
            ],
          },
        },
      }),
    })

    expect(module.getPersistedConnectorFactories()).toHaveLength(2)
    expect(module.hasRestorablePersistedConnector()).toBe(true)
  })

  it('passes persisted ids to predicates without changing their casing', async () => {
    const { module } = await loadWithStorage({
      store: JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [['a', { connector: { id: privyConnectorId } }]],
          },
        },
      }),
    })

    expect(
      module.hasPersistedConnectorMatching((id) => id === privyConnectorId),
    ).toBe(true)
  })

  it('does not report discoverable connectors as eager restore candidates', async () => {
    const { module } = await loadWithStorage({
      store: JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [
              ['a', { connector: { id: 'metaMaskSDK' } }],
              ['b', { connector: { id: 'coinbaseWalletSDK' } }],
            ],
          },
        },
      }),
    })

    expect(module.getPersistedConnectorFactories()).toEqual([])
    expect(module.hasRestorablePersistedConnector()).toBe(false)
  })

  it('preserves the store through only createConfig initial write', async () => {
    const { http, createConfig } = await import('@wagmi/core')
    const { mainnet } = await import('viem/chains')
    const persistedStore = JSON.stringify({
      state: {
        connections: {
          __type: 'Map',
          value: [['a', { connector: { id: 'walletConnect' } }]],
        },
      },
    })
    const { module, values } = await loadWithStorage({ store: persistedStore })

    const config = createConfig({
      chains: [mainnet],
      multiInjectedProviderDiscovery: false,
      storage: module.createConnectorRestoringStorage(),
      transports: { [mainnet.id]: http() },
      ssr: true,
    })

    expect(values.get('wagmi.store')).toBe(persistedStore)
    expect(module.getPersistedConnectorFactories()).toHaveLength(1)

    config.setState((state) => ({ ...state }))
    expect(values.get('wagmi.store')).toContain('"value":[]')
    expect(module.getPersistedConnectorFactories()).toEqual([])
  })

  it('does not treat the last-used connector as active restore intent', async () => {
    const { module } = await loadWithStorage({
      recentConnectorId: 'walletConnect',
    })

    expect(module.getPersistedConnectorFactories()).toEqual([])
    expect(module.hasRestorablePersistedConnector()).toBe(false)
  })

  it('skips malformed entries without discarding valid ones', async () => {
    const { module } = await loadWithStorage({
      store: JSON.stringify({
        state: {
          connections: {
            __type: 'Map',
            value: [
              ['a', null],
              ['b', undefined],
              ['c', { connector: { id: 'walletConnect' } }],
            ],
          },
        },
      }),
    })

    expect(module.getPersistedConnectorFactories()).toHaveLength(1)
  })

  it('does not initialize connectors from malformed storage', async () => {
    const { module } = await loadWithStorage({ store: '{' })
    expect(module.getPersistedConnectorFactories()).toEqual([])
  })
})
