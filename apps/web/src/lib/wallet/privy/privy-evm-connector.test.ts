import { mock } from '@wagmi/connectors'
import {
  http,
  type Config,
  type CreateConnectorFn,
  connect,
  createConfig,
  disconnect,
  getConnections,
  hydrate,
  reconnect,
  // biome-ignore lint/nursery/noRestrictedImports: verifies connector-level chain delegation
  switchChain,
} from '@wagmi/core'
import { createConnectorRestoringStorage } from 'src/lib/wagmi/config/persisted-connectors'
import type { EvmAddress, EvmTxHash } from 'sushi/evm'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import type { EIP1193Provider } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  PRIVY_EVM_CONNECTED_STORAGE_KEY,
  PRIVY_EVM_CONNECTOR_ID,
  PRIVY_EVM_DISCONNECTED_STORAGE_KEY,
  PrivyConnectorCancelledError,
  PrivyRuntimeHostUnavailableError,
  getPrivyEvmConnector,
  hasPrivyEvmReconnectIntent,
  preparePrivyEvmReconnect,
  privyEvmConnector,
} from './privy-evm-connector'
import {
  type PrivyRuntimeStore,
  createPrivyRuntimeStore,
} from './privy-runtime-store'
import type { PrivyEvmWallet, PrivyRuntimeOperationHandlers } from './types'
import { WaitForValueTimeoutError } from './wait-for-value'

const firstAddress = '0x0000000000000000000000000000000000000001' as EvmAddress
const secondAddress = '0x0000000000000000000000000000000000000002' as EvmAddress

interface ProviderHarness {
  emit(event: string, value: unknown): void
  on: ReturnType<typeof vi.fn>
  provider: EIP1193Provider
  removeListener: ReturnType<typeof vi.fn>
  request: ReturnType<typeof vi.fn>
}

function createProvider(initialChainId: number = mainnet.id): ProviderHarness {
  let chainId: number = initialChainId
  const listeners = new Map<string, Set<(value: unknown) => void>>()
  const emit = (event: string, value: unknown): void => {
    for (const listener of listeners.get(event) ?? []) listener(value)
  }
  const on = vi.fn((event: string, listener: (value: unknown) => void) => {
    const eventListeners = listeners.get(event) ?? new Set()
    eventListeners.add(listener)
    listeners.set(event, eventListeners)
  })
  const removeListener = vi.fn(
    (event: string, listener: (value: unknown) => void) => {
      listeners.get(event)?.delete(listener)
    },
  )
  const request = vi.fn(
    async ({ method, params }: { method: string; params?: unknown }) => {
      if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
        return [firstAddress]
      }
      if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
      if (method === 'wallet_switchEthereumChain') {
        const parameter = Array.isArray(params) ? params[0] : undefined
        if (
          !parameter ||
          typeof parameter !== 'object' ||
          !('chainId' in parameter) ||
          typeof parameter.chainId !== 'string'
        ) {
          throw new Error('Missing chain ID')
        }
        chainId = Number(parameter.chainId)
        emit('chainChanged', parameter.chainId)
        return null
      }
      throw new Error(`Unexpected method: ${method}`)
    },
  )

  return {
    emit,
    on,
    provider: { on, removeListener, request } as unknown as EIP1193Provider,
    removeListener,
    request,
  }
}

function createWallet(
  address: EvmAddress,
  providerHarness = createProvider(),
): PrivyEvmWallet {
  return {
    address,
    getEthereumProvider: vi.fn(async () => providerHarness.provider),
    switchChain: vi.fn(async () => undefined),
  }
}

function createOperations(
  overrides: Partial<PrivyRuntimeOperationHandlers> = {},
): PrivyRuntimeOperationHandlers {
  return {
    authenticate: vi.fn(async () => undefined),
    connectOrCreateEvmWallet: vi.fn(async () => undefined),
    exportEvmWallet: vi.fn(async () => undefined),
    exportSvmWallet: vi.fn(async () => undefined),
    loginSvm: vi.fn(async () => undefined),
    logout: vi.fn(async () => undefined),
    sendEvmTransaction: vi.fn(async () => ({
      hash: '0x01' as EvmTxHash,
    })),
    signSvmTransaction: vi.fn(async () => ({
      signedTransaction: new Uint8Array(),
    })),
    signAndSendSvmTransaction: vi.fn(async () => ({
      signature: 'signature' as SvmTxHash,
    })),
    ...overrides,
  }
}

function publishAuthenticated({
  hasEvmAccount = true,
  operations = createOperations(),
  runtimeStore,
  wallet,
  walletsReady = true,
}: {
  hasEvmAccount?: boolean
  operations?: PrivyRuntimeOperationHandlers
  runtimeStore: PrivyRuntimeStore
  wallet: PrivyEvmWallet | null
  walletsReady?: boolean
}): void {
  runtimeStore.publishRuntime({
    authenticated: true,
    evmWallet: wallet,
    hasEvmAccount,
    hasSvmAccount: false,
    operations,
    svmWallet: null,
    walletsReady,
  })
}

function publishLoggedOut(
  runtimeStore: PrivyRuntimeStore,
  operations = createOperations(),
): void {
  runtimeStore.publishRuntime({
    authenticated: false,
    operations,
    walletsReady: true,
  })
}

interface HarnessOptions {
  connectTimeoutMs?: number
  connectors?: CreateConnectorFn[]
  hostMounted?: boolean
  providerTimeoutMs?: number
  reconnectTimeoutMs?: number
  runtimeStore?: PrivyRuntimeStore
  ssr?: boolean
}

function createHarness({
  connectTimeoutMs = 250,
  connectors = [],
  hostMounted = true,
  providerTimeoutMs = 100,
  reconnectTimeoutMs = 250,
  runtimeStore = createPrivyRuntimeStore(),
  ssr = false,
}: HarnessOptions = {}) {
  const config: Config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      privyEvmConnector({
        connectTimeoutMs,
        getWagmiState: () => config.state,
        providerTimeoutMs,
        reconnectTimeoutMs,
        runtimeStore,
      }),
      ...connectors,
    ],
    multiInjectedProviderDiscovery: false,
    ssr,
    storage: createConnectorRestoringStorage(),
    transports: { [mainnet.id]: http(), [sepolia.id]: http() },
  })
  const unmountHost = hostMounted
    ? runtimeStore.mountRuntimeHost()
    : () => undefined
  const connector = getPrivyEvmConnector(config)
  if (!connector) throw new Error('Privy connector was not registered')
  return { config, connector, runtimeStore, unmountHost }
}

function createLocalStorage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear() {
      values.clear()
    },
    getItem(key) {
      return values.get(key) ?? null
    },
    key(index) {
      return [...values.keys()][index] ?? null
    },
    removeItem(key) {
      values.delete(key)
    },
    setItem(key, value) {
      values.set(key, value)
    },
  }
}

function seedStorageItem(key: string, value: unknown): void {
  window.localStorage.setItem(`wagmi.${key}`, JSON.stringify(value))
}

function seedPersistedConnection({
  connectorId = PRIVY_EVM_CONNECTOR_ID,
  connectorType = 'privy',
  recentConnectorId = connectorId,
}: {
  connectorId?: string
  connectorType?: string
  recentConnectorId?: string
} = {}): void {
  const uid = 'persisted-privy'
  window.localStorage.setItem(
    'wagmi.store',
    JSON.stringify({
      state: {
        chainId: mainnet.id,
        connections: {
          __type: 'Map',
          value: [
            [
              uid,
              {
                accounts: [firstAddress],
                chainId: mainnet.id,
                connector: {
                  id: connectorId,
                  name: 'Email',
                  type: connectorType,
                  uid,
                },
              },
            ],
          ],
        },
        current: uid,
      },
      version: 3,
    }),
  )
  seedStorageItem('recentConnectorId', recentConnectorId)
}

function deferred<T>() {
  let reject!: (error: Error) => void
  let resolve!: (value: T) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, reject, resolve }
}

beforeEach(() => {
  vi.stubGlobal(
    'window',
    Object.assign(new EventTarget(), { localStorage: createLocalStorage() }),
  )
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('deferred Privy EVM connector', () => {
  it('registers one stable connector without loading Privy for other users', async () => {
    const { config, connector, runtimeStore } = createHarness()

    expect(connector.id).toBe(PRIVY_EVM_CONNECTOR_ID)
    expect(connector.type).toBe('privy')
    expect(await connector.getProvider()).toBe(await connector.getProvider())
    await expect(reconnect(config)).resolves.toEqual([])
    expect(runtimeStore.getSnapshot()).toMatchObject({
      requested: false,
      status: 'unavailable',
    })
  })

  it('restores an active session through ordinary Wagmi hydration', async () => {
    seedPersistedConnection()
    seedStorageItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true)
    const { config, connector, runtimeStore } = createHarness({ ssr: true })
    const wallet = createWallet(firstAddress)

    await hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => {
      expect(runtimeStore.getSnapshot().status).toBe('loading')
    })
    publishAuthenticated({ runtimeStore, wallet })

    await vi.waitFor(() => expect(config.state.status).toBe('connected'))
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ accounts: [firstAddress], connector }),
    ])
  })

  it('restores a connection started before an OAuth redirect', async () => {
    seedStorageItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY, true)
    const { config, connector, runtimeStore } = createHarness({ ssr: true })

    await preparePrivyEvmReconnect(config)
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBe(true)
    await expect(
      config.storage?.getItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
    await expect(config.storage?.getItem('recentConnectorId')).resolves.toBe(
      PRIVY_EVM_CONNECTOR_ID,
    )

    await hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => {
      expect(runtimeStore.getSnapshot().status).toBe('loading')
    })
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress),
    })

    await vi.waitFor(() => expect(config.state.status).toBe('connected'))
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ accounts: [firstAddress], connector }),
    ])
  })

  it('settles an expired session and does not request Privy again', async () => {
    seedPersistedConnection()
    seedStorageItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true)
    const first = createHarness({ ssr: true })

    await hydrate(first.config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => {
      expect(first.runtimeStore.getSnapshot().status).toBe('loading')
    })
    publishLoggedOut(first.runtimeStore)
    await vi.waitFor(() =>
      expect(first.config.state.status).toBe('disconnected'),
    )
    await expect(
      first.config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()

    const second = createHarness({ ssr: true })
    await hydrate(second.config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() =>
      expect(second.config.state.status).toBe('disconnected'),
    )
    expect(second.runtimeStore.getSnapshot().requested).toBe(false)
  })

  it('logs in or provisions on an explicit first connection', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const wallet = createWallet(firstAddress)
    const operations = createOperations({
      connectOrCreateEvmWallet: vi.fn(async () => {
        publishAuthenticated({ operations, runtimeStore, wallet })
      }),
    })
    publishLoggedOut(runtimeStore, operations)

    await expect(connect(config, { connector })).resolves.toMatchObject({
      accounts: [firstAddress],
    })
    expect(operations.connectOrCreateEvmWallet).toHaveBeenCalledOnce()
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBe(true)
    expect(hasPrivyEvmReconnectIntent()).toBe(true)

    await disconnect(config, { connector })
    publishAuthenticated({
      hasEvmAccount: false,
      operations,
      runtimeStore,
      wallet: null,
    })
    await expect(connect(config, { connector })).resolves.toMatchObject({
      accounts: [firstAddress],
    })
    expect(operations.connectOrCreateEvmWallet).toHaveBeenCalledTimes(2)
  })

  it('keeps Wagmi disconnect separate from logout and stays disconnected after reload', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const operations = createOperations()
    publishAuthenticated({
      operations,
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await connect(config, { connector })

    await disconnect(config, { connector })

    expect(operations.logout).not.toHaveBeenCalled()
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
    await expect(
      config.storage?.getItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY),
    ).resolves.toBe(true)
    expect(hasPrivyEvmReconnectIntent()).toBe(false)

    const reloaded = createHarness({ ssr: true })
    await hydrate(reloaded.config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() =>
      expect(reloaded.config.state.status).toBe('disconnected'),
    )
    expect(reloaded.runtimeStore.getSnapshot().requested).toBe(false)
  })

  it('uses the same connector and facade after logout and login as another user', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const firstProvider = createProvider()
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress, firstProvider),
    })
    await connect(config, { connector })
    const uid = connector.uid
    const facade = (await connector.getProvider()) as EIP1193Provider

    publishLoggedOut(runtimeStore)
    await vi.waitFor(() => expect(config.state.status).toBe('disconnected'))

    const secondProvider = createProvider(sepolia.id)
    const secondWallet = createWallet(secondAddress, secondProvider)
    const operations = createOperations({
      connectOrCreateEvmWallet: vi.fn(async () => {
        publishAuthenticated({ operations, runtimeStore, wallet: secondWallet })
      }),
    })
    publishLoggedOut(runtimeStore, operations)

    await expect(connect(config, { connector })).resolves.toMatchObject({
      accounts: [secondAddress],
    })
    expect(connector.uid).toBe(uid)
    expect(await connector.getProvider()).toBe(facade)
    await expect(connector.getAccounts()).resolves.toEqual([secondAddress])
  })

  it('suspends across runtime replay and atomically installs the newest provider', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const firstProvider = createProvider()
    const firstWallet = createWallet(firstAddress, firstProvider)
    publishAuthenticated({ runtimeStore, wallet: firstWallet })
    await connect(config, { connector })
    const facade = (await connector.getProvider()) as EIP1193Provider

    runtimeStore.setUnavailable()
    await expect(
      facade.request({ method: 'eth_chainId' }),
    ).rejects.toMatchObject({ code: 4900 })
    expect(config.state.status).toBe('connected')

    publishAuthenticated({ runtimeStore, wallet: firstWallet })
    await vi.waitFor(async () => {
      await expect(facade.request({ method: 'eth_chainId' })).resolves.toBe(
        '0x1',
      )
    })

    const staleProvider = deferred<EIP1193Provider>()
    const staleWallet: PrivyEvmWallet = {
      address: firstAddress,
      getEthereumProvider: vi.fn(() => staleProvider.promise),
      switchChain: vi.fn(async () => undefined),
    }
    const newestProvider = createProvider(sepolia.id)
    const newestWallet = createWallet(firstAddress, newestProvider)
    publishAuthenticated({ runtimeStore, wallet: staleWallet })
    publishAuthenticated({ runtimeStore, wallet: newestWallet })

    await vi.waitFor(async () => {
      await expect(facade.request({ method: 'eth_chainId' })).resolves.toBe(
        `0x${sepolia.id.toString(16)}`,
      )
    })
    staleProvider.reject(new Error('stale provider failed'))
    await Promise.resolve()

    expect(config.state.status).toBe('connected')
    await expect(facade.request({ method: 'eth_chainId' })).resolves.toBe(
      `0x${sepolia.id.toString(16)}`,
    )
    expect(firstProvider.removeListener).toHaveBeenCalled()
    expect(newestProvider.on).toHaveBeenCalled()
  })

  it('switches the held provider and treats runtime chain alignment as best effort', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const provider = createProvider()
    const wallet = createWallet(firstAddress, provider)
    wallet.switchChain = vi.fn(async () => {
      throw new Error('React state update failed')
    })
    publishAuthenticated({ runtimeStore, wallet })
    await connect(config, { connector })

    await expect(
      switchChain(config, { chainId: sepolia.id }),
    ).resolves.toMatchObject({ id: sepolia.id })

    expect(provider.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${sepolia.id.toString(16)}` }],
    })
    expect(wallet.switchChain).toHaveBeenCalledWith(sepolia.id)
    expect(getConnections(config)[0]?.chainId).toBe(sepolia.id)
    expect(config.state.chainId).toBe(sepolia.id)

    // Privy rebuilds its wallet objects from React chain state, which failed
    // to update above. The replacement provider must follow Wagmi's chain.
    const staleChainProvider = createProvider(mainnet.id)
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress, staleChainProvider),
    })
    await vi.waitFor(() => {
      expect(staleChainProvider.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${sepolia.id.toString(16)}` }],
      })
    })
    const facade = (await connector.getProvider()) as EIP1193Provider
    await vi.waitFor(async () => {
      await expect(facade.request({ method: 'eth_chainId' })).resolves.toBe(
        `0x${sepolia.id.toString(16)}`,
      )
    })
    expect(getConnections(config)[0]?.chainId).toBe(sepolia.id)
    expect(config.state.chainId).toBe(sepolia.id)
  })

  it('surfaces runtime and authentication failures and can retry an import failure', async () => {
    const { config, connector, runtimeStore } = createHarness()
    const firstAttempt = connect(config, { connector })
    const importError = new Error('Privy chunk failed')
    runtimeStore.setError(importError)
    await expect(firstAttempt).rejects.toBe(importError)

    const retry = connect(config, { connector })
    expect(runtimeStore.getSnapshot()).toMatchObject({
      requested: true,
      revision: 1,
      status: 'loading',
    })
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await expect(retry).resolves.toMatchObject({ accounts: [firstAddress] })
    await disconnect(config, { connector })

    const authenticationError = new Error('Login was rejected')
    publishLoggedOut(
      runtimeStore,
      createOperations({
        connectOrCreateEvmWallet: vi.fn(async () => {
          throw authenticationError
        }),
      }),
    )
    await expect(connect(config, { connector })).rejects.toBe(
      authenticationError,
    )
  })

  it('remounts the runtime only when a user-initiated connection waited it out', async () => {
    vi.useFakeTimers()
    const { config, connector, runtimeStore } = createHarness({
      connectTimeoutMs: 100,
    })

    // The runtime never becomes ready: this is the one case that remounts.
    const stalled = connect(config, { connector })
    const stalledAssertion = expect(stalled).rejects.toBeInstanceOf(
      WaitForValueTimeoutError,
    )
    await vi.advanceTimersByTimeAsync(100)
    await stalledAssertion
    expect(runtimeStore.getSnapshot()).toMatchObject({
      revision: 1,
      status: 'loading',
    })

    const retry = connect(config, { connector })
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await expect(retry).resolves.toMatchObject({ accounts: [firstAddress] })
    await disconnect(config, { connector })
    expect(runtimeStore.getSnapshot().revision).toBe(1)
  })

  it('never times out the login modal and cancels it without remounting', async () => {
    vi.useFakeTimers()
    const { config, connector, runtimeStore } = createHarness({
      connectTimeoutMs: 100,
    })
    const never = new Promise<void>(() => undefined)
    publishLoggedOut(
      runtimeStore,
      createOperations({
        connectOrCreateEvmWallet: vi.fn(() => never),
      }),
    )

    const pending = connect(config, { connector })
    let settled = false
    pending.then(
      () => {
        settled = true
      },
      () => {
        settled = true
      },
    )
    // A user reading an OTP email may take far longer than any phase timeout.
    await vi.advanceTimersByTimeAsync(100 * 50)
    expect(settled).toBe(false)
    expect(runtimeStore.getSnapshot().revision).toBe(0)

    const cancelAssertion = expect(pending).rejects.toBeInstanceOf(
      PrivyConnectorCancelledError,
    )
    await disconnect(config, { connector })
    await cancelAssertion
    expect(runtimeStore.getSnapshot().revision).toBe(0)
  })

  it('restarts the phase deadline after login and waits for the wallet', async () => {
    vi.useFakeTimers()
    const { config, connector, runtimeStore } = createHarness({
      connectTimeoutMs: 100,
    })
    const login = deferred<void>()
    const operations = createOperations({
      connectOrCreateEvmWallet: vi.fn(() => login.promise),
    })
    publishLoggedOut(runtimeStore, operations)

    const pending = connect(config, { connector })
    await vi.advanceTimersByTimeAsync(1_000)
    // Login completes long after the deadline would have expired; the wallet
    // list is still allowed a full phase to surface.
    publishAuthenticated({
      operations,
      runtimeStore,
      wallet: null,
      walletsReady: false,
    })
    login.resolve()
    await vi.advanceTimersByTimeAsync(50)
    publishAuthenticated({
      operations,
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await expect(pending).resolves.toMatchObject({ accounts: [firstAddress] })
  })

  it('aborts a superseded restore without remounting the shared runtime', async () => {
    seedPersistedConnection()
    seedStorageItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true)
    const { config, connector, runtimeStore } = createHarness({ ssr: true })
    const wallet = createWallet(firstAddress)

    await hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => {
      expect(runtimeStore.getSnapshot().status).toBe('loading')
    })

    // The user clicks "Email" while Wagmi is still restoring.
    const userConnect = connect(config, { connector })
    publishAuthenticated({ runtimeStore, wallet })

    await expect(userConnect).resolves.toMatchObject({
      accounts: [firstAddress],
    })
    await vi.waitFor(() => expect(config.state.status).toBe('connected'))
    expect(runtimeStore.getSnapshot().revision).toBe(0)
    expect(getConnections(config)).toHaveLength(1)
  })

  it('leaves a slow restore alone and keeps the reconnect intent', async () => {
    vi.useFakeTimers()
    seedPersistedConnection()
    seedStorageItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true)
    const { config, runtimeStore } = createHarness({
      reconnectTimeoutMs: 100,
      ssr: true,
    })

    const restoring = hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.advanceTimersByTimeAsync(100)
    await restoring
    await vi.waitFor(() => expect(config.state.status).toBe('disconnected'))

    expect(runtimeStore.getSnapshot()).toMatchObject({
      revision: 0,
      status: 'loading',
    })
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBe(true)
  })

  it('drops the reconnect intent when Privy logs out underneath a connection', async () => {
    const { config, connector, runtimeStore } = createHarness()
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await connect(config, { connector })

    publishLoggedOut(runtimeStore)
    await vi.waitFor(() => expect(config.state.status).toBe('disconnected'))

    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
    await expect(
      config.storage?.getItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
    expect(hasPrivyEvmReconnectIntent()).toBe(false)
  })

  it('does not let a delayed reconnect overwrite a user-selected wallet', async () => {
    const otherFactory = mock({ accounts: [secondAddress] })
    const provider = deferred<EIP1193Provider>()
    const runtimeStore = createPrivyRuntimeStore()
    const wallet: PrivyEvmWallet = {
      address: firstAddress,
      getEthereumProvider: vi.fn(() => provider.promise),
      switchChain: vi.fn(async () => undefined),
    }
    const { config, connector } = createHarness({
      connectors: [otherFactory],
      runtimeStore,
    })
    await config.storage?.setItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true)
    publishAuthenticated({ runtimeStore, wallet })

    const restoring = reconnect(config, { connectors: [connector] })
    await vi.waitFor(() => {
      expect(wallet.getEthereumProvider).toHaveBeenCalledOnce()
    })
    const otherConnector = config.connectors.find(
      (candidate) => candidate.id === 'mock',
    )
    if (!otherConnector) throw new Error('Mock connector was not registered')
    await connect(config, { connector: otherConnector })
    provider.resolve(createProvider().provider)

    await expect(restoring).resolves.toEqual([])
    expect(config.state.current).toBe(otherConnector.uid)
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
  })

  it('migrates an address-scoped persisted connector and its recent ID', async () => {
    const legacyId = `${PRIVY_EVM_CONNECTOR_ID}.${firstAddress}`
    seedPersistedConnection({
      connectorId: legacyId,
      connectorType: 'injected',
    })
    const { config, connector, runtimeStore } = createHarness({ ssr: true })

    await hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => {
      expect(runtimeStore.getSnapshot().status).toBe('loading')
    })
    publishAuthenticated({
      runtimeStore,
      wallet: createWallet(firstAddress),
    })
    await vi.waitFor(() => expect(config.state.status).toBe('connected'))

    expect(getConnections(config)[0]?.connector).toBe(connector)
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBe(true)
    await expect(config.storage?.getItem('recentConnectorId')).resolves.toBe(
      PRIVY_EVM_CONNECTOR_ID,
    )
  })

  it('honors a legacy disconnect shim during migration', async () => {
    const legacyId = `${PRIVY_EVM_CONNECTOR_ID}.${firstAddress}`
    seedPersistedConnection({ connectorId: legacyId })
    seedStorageItem(`${legacyId}.disconnected`, true)
    const { config, runtimeStore } = createHarness({ ssr: true })

    await hydrate(config, { reconnectOnMount: true }).onMount()
    await vi.waitFor(() => expect(config.state.status).toBe('disconnected'))

    expect(runtimeStore.getSnapshot().requested).toBe(false)
    await expect(
      config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
    ).resolves.toBeNull()
  })

  it('never throws from authorization and leaves Wagmi reconnect reusable', async () => {
    const { config } = createHarness()
    if (!config.storage) throw new Error('Storage is unavailable')
    vi.spyOn(config.storage, 'getItem').mockRejectedValue(
      new Error('Storage failed'),
    )

    await expect(reconnect(config)).resolves.toEqual([])
    expect(config.state.status).toBe('disconnected')
    await expect(reconnect(config)).resolves.toEqual([])
    expect(config.state.status).toBe('disconnected')
  })

  it('fails immediately when no runtime host exists', async () => {
    const { config, connector, runtimeStore } = createHarness({
      hostMounted: false,
    })

    await expect(connect(config, { connector })).rejects.toBeInstanceOf(
      PrivyRuntimeHostUnavailableError,
    )
    expect(runtimeStore.getSnapshot().requested).toBe(false)
  })
})
