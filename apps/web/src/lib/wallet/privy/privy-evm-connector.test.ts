import { mock } from '@wagmi/connectors'
import {
  http,
  connect,
  createConfig,
  getConnections,
  getConnectors,
  reconnect,
} from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInjectedConnector } from '../namespaces/evm/adapters/injected'
import {
  PRIVY_EVM_CONNECTOR_ID,
  getPrivyEvmConnector,
  registerPrivyEvmConnector,
  unregisterPrivyEvmConnector,
} from './privy-evm-connector'

const firstAddress = '0x0000000000000000000000000000000000000001' as EvmAddress
const secondAddress = '0x0000000000000000000000000000000000000002' as EvmAddress

function createProviderController(
  initialAddress: EvmAddress,
  initialChainId = mainnet.id,
) {
  let address = initialAddress
  let chainId: number = initialChainId
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
        return [address]
      }
      if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
      if (method === 'wallet_revokePermissions') return null
      if (method === 'wallet_switchEthereumChain') {
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
    provider,
    request,
    setAddress(nextAddress: EvmAddress) {
      address = nextAddress
    },
  }
}

function createWagmiConfig(
  connectors: Parameters<typeof createConfig>[0]['connectors'] = [],
) {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
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

beforeEach(() => {
  vi.stubGlobal(
    'window',
    Object.assign(new EventTarget(), { localStorage: createLocalStorage() }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Privy EVM connector registration', () => {
  it('registers a standard injected connector around the actual provider', async () => {
    const config = createWagmiConfig()
    const controller = createProviderController(firstAddress)

    expect(getPrivyEvmConnector(config)).toBeUndefined()
    const connector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: controller.provider,
    })

    expect(getPrivyEvmConnector(config)).toBe(connector)
    expect(connector.id).toBe(PRIVY_EVM_CONNECTOR_ID)
    expect(connector.type).toBe('injected')
    expect(isInjectedConnector(connector)).toBe(false)
    await expect(connector.getProvider()).resolves.toBe(controller.provider)
    await expect(connector.isAuthorized()).resolves.toBe(true)
  })

  it('reuses the connector for the same embedded account', () => {
    const config = createWagmiConfig()
    const first = createProviderController(firstAddress)
    const second = createProviderController(firstAddress)

    const connector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: first.provider,
    })
    const sameConnector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: second.provider,
    })

    expect(sameConnector).toBe(connector)
    expect(
      getConnectors(config).filter(
        (candidate) => candidate.id === PRIVY_EVM_CONNECTOR_ID,
      ),
    ).toHaveLength(1)
  })

  it('replaces the connector when Privy changes embedded accounts', async () => {
    const config = createWagmiConfig()
    const first = createProviderController(firstAddress)
    const second = createProviderController(secondAddress)
    const firstConnector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: first.provider,
    })
    expect(getPrivyEvmConnector(config, secondAddress)).toBeUndefined()

    const secondConnector = registerPrivyEvmConnector({
      address: secondAddress,
      config,
      provider: second.provider,
    })

    expect(secondConnector).not.toBe(firstConnector)
    expect(getPrivyEvmConnector(config)).toBe(secondConnector)
    await expect(secondConnector.getProvider()).resolves.toBe(second.provider)
  })

  it('uses Wagmi event handling from the injected connector', async () => {
    const config = createWagmiConfig()
    const controller = createProviderController(firstAddress)
    const connector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: controller.provider,
    })
    await connect(config, { connector })
    const onChange = vi.fn()
    connector.emitter.on('change', onChange)
    controller.setAddress(secondAddress)

    controller.emit('accountsChanged', [secondAddress])

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ accounts: [secondAddress] }),
    )
  })

  it('reconnects through the standard connector without a permission prompt', async () => {
    const config = createWagmiConfig()
    const controller = createProviderController(firstAddress)
    const connector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: controller.provider,
    })

    const connections = await reconnect(config, { connectors: [connector] })

    expect(connections).toEqual([
      expect.objectContaining({ accounts: [firstAddress], connector }),
    ])
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ accounts: [firstAddress], connector }),
    ])
    expect(
      controller.request.mock.calls.map(([parameters]) => parameters.method),
    ).not.toContain('wallet_requestPermissions')
  })

  it('unregisters only Privy and preserves another active connector', async () => {
    const mockConnector = mock({ accounts: [secondAddress] })
    const config = createWagmiConfig([mockConnector])
    const standardConnector = getConnectors(config)[0]!
    const controller = createProviderController(firstAddress)
    const privyConnector = registerPrivyEvmConnector({
      address: firstAddress,
      config,
      provider: controller.provider,
    })
    await connect(config, { connector: standardConnector })
    await connect(config, { connector: privyConnector })
    expect(getConnections(config)).toHaveLength(2)

    unregisterPrivyEvmConnector(config)

    expect(getPrivyEvmConnector(config)).toBeUndefined()
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ connector: standardConnector }),
    ])
    expect(config.state.current).toBe(standardConnector.uid)
    expect(config.state.status).toBe('connected')
    expect(
      controller.request.mock.calls.map(([parameters]) => parameters.method),
    ).not.toContain('wallet_revokePermissions')
  })
})
