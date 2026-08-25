import {
  http,
  ProviderNotFoundError,
  connect,
  createConfig,
  disconnect,
  getConnectors,
} from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider, Hex } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInjectedConnector } from '../namespaces/evm/adapters/injected'
import {
  PRIVY_EVM_CONNECTOR_ID,
  createPrivyEvmConnector,
} from './privy-evm-connector'
import {
  type PrivyRuntimeStore,
  createPrivyRuntimeStore,
} from './privy-runtime-store'
import type { PrivyEvmWallet, PrivyRuntimeOperationHandlers } from './types'

const firstAddress = '0x0000000000000000000000000000000000000001' as EvmAddress
const secondAddress = '0x0000000000000000000000000000000000000002' as EvmAddress

function createDeferred<Value>(): {
  promise: Promise<Value>
  resolve(value: Value): void
} {
  let resolve!: (value: Value) => void
  const promise = new Promise<Value>((promiseResolve) => {
    resolve = promiseResolve
  })
  return { promise, resolve }
}

function createOperations(): PrivyRuntimeOperationHandlers {
  return {
    connectOrCreateEvmWallet: vi.fn(async () => undefined),
    exportEvmWallet: vi.fn(async () => undefined),
    exportSvmWallet: vi.fn(async () => undefined),
    loginSvm: vi.fn(async () => undefined),
    logout: vi.fn(async () => undefined),
    sendEvmTransaction: vi.fn(async () => ({ hash: '0x01' as Hex })),
    signAndSendSvmTransaction: vi.fn(async () => ({ signature: 'signature' })),
    signSvmTransaction: vi.fn(async ({ transaction }) => ({
      signedTransaction: transaction,
    })),
  }
}

function createProviderController(
  initialAddress: EvmAddress,
  initialChainId: number,
  options: { onSwitch?(): void } = {},
) {
  let account = initialAddress
  let chainId = initialChainId
  const listeners = new Map<string, Set<(...parameters: unknown[]) => void>>()
  const request = vi.fn(
    async ({
      method,
      params,
    }: {
      method: string
      params?: readonly unknown[]
    }) => {
      if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
        return [account]
      }
      if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
      if (method === 'wallet_requestPermissions') {
        return [{ caveats: [{ value: [account] }] }]
      }
      if (method === 'wallet_revokePermissions') return null
      if (method === 'wallet_switchEthereumChain') {
        options.onSwitch?.()
        const parameter = params?.[0]
        if (
          parameter &&
          typeof parameter === 'object' &&
          'chainId' in parameter &&
          typeof parameter.chainId === 'string'
        ) {
          chainId = Number(parameter.chainId)
        }
        return null
      }
      throw new Error(`Unexpected method: ${method}`)
    },
  )

  const provider: EIP1193Provider = {
    request: request as EIP1193Provider['request'],
    on(event, listener) {
      const eventListeners = listeners.get(event) ?? new Set()
      eventListeners.add(
        listener as unknown as (...parameters: unknown[]) => void,
      )
      listeners.set(event, eventListeners)
    },
    removeListener(event, listener) {
      listeners
        .get(event)
        ?.delete(listener as unknown as (...parameters: unknown[]) => void)
    },
  }

  return {
    emit(event: string, value: unknown) {
      for (const listener of listeners.get(event) ?? []) listener(value)
    },
    getListenerCount() {
      return [...listeners.values()].reduce((count, set) => count + set.size, 0)
    },
    provider,
    request,
    setAccount(nextAccount: EvmAddress) {
      account = nextAccount
    },
  }
}

function getConnector(store: PrivyRuntimeStore) {
  const config = createConfig({
    chains: [mainnet, sepolia],
    connectors: [createPrivyEvmConnector(store)],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
  return { config, connector: getConnectors(config)[0]! }
}

function publishWallet(store: PrivyRuntimeStore, wallet: PrivyEvmWallet): void {
  store.requestRuntime()
  store.publishRuntime({
    authenticated: true,
    evmWallet: wallet,
    operations: createOperations(),
  })
}

beforeEach(() => {
  const values = new Map<string, string>()
  const localStorage: Storage = {
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
  vi.stubGlobal('window', Object.assign(new EventTarget(), { localStorage }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Privy EVM connector', () => {
  it('uses a fixed standard connector that is inert before Privy loads', async () => {
    const { connector } = getConnector(createPrivyRuntimeStore())

    expect(connector.id).toBe(PRIVY_EVM_CONNECTOR_ID)
    expect(connector.type).toBe('injected')
    expect(isInjectedConnector(connector)).toBe(false)
    await expect(connector.getProvider()).resolves.toBeDefined()
    await expect(connector.isAuthorized()).resolves.toBe(false)
  })

  it('connects through Wagmi injected-connector semantics', async () => {
    const store = createPrivyRuntimeStore()
    const { config, connector } = getConnector(store)
    const controller = createProviderController(firstAddress, mainnet.id)
    const getProvider = vi.fn(async () => controller.provider)
    publishWallet(store, {
      address: firstAddress,
      getProvider,
    })

    await expect(connector.isAuthorized()).resolves.toBe(true)
    await expect(connect(config, { connector })).resolves.toEqual({
      accounts: [firstAddress],
      chainId: mainnet.id,
    })
    await expect(connector.getChainId()).resolves.toBe(mainnet.id)
    expect(getProvider).toHaveBeenCalledOnce()

    await disconnect(config, { connector })
    await expect(connector.isAuthorized()).resolves.toBe(false)
  })

  it('rebinds when the runtime publishes a replacement provider', async () => {
    const store = createPrivyRuntimeStore()
    const initial = createProviderController(firstAddress, mainnet.id)
    publishWallet(store, {
      address: firstAddress,
      getProvider: vi.fn(async () => initial.provider),
    })
    const { config, connector } = getConnector(store)
    await connect(config, { connector })
    const replacement = createProviderController(firstAddress, mainnet.id)

    store.publishRuntime({
      authenticated: true,
      evmWallet: {
        address: firstAddress,
        getProvider: vi.fn(async () => replacement.provider),
      },
      operations: createOperations(),
    })

    await vi.waitFor(() => {
      expect(initial.getListenerCount()).toBe(0)
      expect(replacement.getListenerCount()).toBeGreaterThan(0)
    })
  })

  it.each([
    ['same-address', firstAddress],
    ['different-address', secondAddress],
  ] as const)(
    'rejects a stale %s provider resolution',
    async (_case, currentAddress) => {
      const store = createPrivyRuntimeStore()
      const stale = createProviderController(firstAddress, mainnet.id)
      const current = createProviderController(currentAddress, sepolia.id)
      const staleProvider = createDeferred<EIP1193Provider>()
      const getStaleProvider = vi.fn(() => staleProvider.promise)
      publishWallet(store, {
        address: firstAddress,
        getProvider: getStaleProvider,
      })
      const { connector } = getConnector(store)
      const provider = await connector.getProvider()
      if (!provider) throw new Error('Privy provider bridge is unavailable')

      const pendingChainId = provider.request({ method: 'eth_chainId' })
      expect(getStaleProvider).toHaveBeenCalledOnce()

      const getCurrentProvider = vi.fn(async () => current.provider)
      store.publishRuntime({
        authenticated: true,
        evmWallet: {
          address: currentAddress,
          getProvider: getCurrentProvider,
        },
        operations: createOperations(),
      })
      await vi.waitFor(() => expect(getCurrentProvider).toHaveBeenCalledOnce())

      staleProvider.resolve(stale.provider)

      await expect(pendingChainId).rejects.toBeInstanceOf(ProviderNotFoundError)
      expect(stale.request).not.toHaveBeenCalled()
      expect(current.request).not.toHaveBeenCalled()
    },
  )

  it('rebinds when Privy replaces its provider after a chain switch', async () => {
    const store = createPrivyRuntimeStore()
    const switched = createProviderController(firstAddress, sepolia.id)
    let provider: EIP1193Provider
    const initial = createProviderController(firstAddress, mainnet.id, {
      onSwitch() {
        provider = switched.provider
      },
    })
    provider = initial.provider
    const getProvider = vi.fn(async () => provider)
    publishWallet(store, {
      address: firstAddress,
      getProvider,
    })
    const { config, connector } = getConnector(store)
    await connect(config, { connector })

    await connector.switchChain?.({ chainId: sepolia.id })

    await expect(connector.getChainId()).resolves.toBe(sepolia.id)
    expect(initial.getListenerCount()).toBe(0)
    expect(switched.getListenerCount()).toBeGreaterThan(0)
  })

  it('recovers from a transient provider refresh failure after switching chains', async () => {
    const store = createPrivyRuntimeStore()
    const initial = createProviderController(firstAddress, mainnet.id)
    const switched = createProviderController(firstAddress, sepolia.id)
    const getProvider = vi
      .fn<PrivyEvmWallet['getProvider']>()
      .mockResolvedValueOnce(initial.provider)
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValue(switched.provider)
    publishWallet(store, {
      address: firstAddress,
      getProvider,
    })
    const { config, connector } = getConnector(store)
    await connect(config, { connector })

    await expect(
      connector.switchChain?.({ chainId: sepolia.id }),
    ).resolves.toMatchObject({ id: sepolia.id })

    expect(getProvider).toHaveBeenCalledTimes(3)
    expect(initial.getListenerCount()).toBe(0)
    expect(switched.getListenerCount()).toBeGreaterThan(0)
  })

  it('uses Wagmi retries for transient Privy provider lookup failures', async () => {
    const store = createPrivyRuntimeStore()
    const controller = createProviderController(firstAddress, mainnet.id)
    const getProvider = vi
      .fn<PrivyEvmWallet['getProvider']>()
      .mockRejectedValueOnce(new Error('temporary'))
      .mockResolvedValue(controller.provider)
    publishWallet(store, {
      address: firstAddress,
      getProvider,
    })
    const { connector } = getConnector(store)

    await expect(connector.isAuthorized()).resolves.toBe(true)
    expect(getProvider).toHaveBeenCalledTimes(2)
  })

  it('forwards account changes through the standard connector', async () => {
    const store = createPrivyRuntimeStore()
    const controller = createProviderController(firstAddress, mainnet.id)
    publishWallet(store, {
      address: firstAddress,
      getProvider: vi.fn(async () => controller.provider),
    })
    const { config, connector } = getConnector(store)
    await connect(config, { connector })
    const change = vi.fn()
    connector.emitter.on('change', change)
    controller.setAccount(secondAddress)

    controller.emit('accountsChanged', [secondAddress])

    expect(change).toHaveBeenCalledWith(
      expect.objectContaining({ accounts: [secondAddress] }),
    )
  })

  it('disconnects the standard connector when Privy removes its wallet', async () => {
    const store = createPrivyRuntimeStore()
    const controller = createProviderController(firstAddress, mainnet.id)
    publishWallet(store, {
      address: firstAddress,
      getProvider: vi.fn(async () => controller.provider),
    })
    const { config, connector } = getConnector(store)
    await connect(config, { connector })
    const disconnect = vi.fn()
    connector.emitter.on('disconnect', disconnect)

    store.publishRuntime({
      authenticated: false,
      operations: createOperations(),
    })

    await vi.waitFor(() => expect(disconnect).toHaveBeenCalledOnce())
    expect(controller.getListenerCount()).toBe(0)
  })
})
