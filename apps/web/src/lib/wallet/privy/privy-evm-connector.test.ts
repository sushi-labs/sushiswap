import { mock } from '@wagmi/connectors'
import {
  http,
  connect,
  createConfig,
  getConnections,
  getConnectors,
  reconnect,
} from '@wagmi/core'
// biome-ignore lint/nursery/noRestrictedImports: this test exercises the connector-level core action
import { switchChain } from '@wagmi/core'
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
  initialChainId: number = mainnet.id,
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

function registerController({
  address,
  config,
  controller,
  switchChain: switchPrivyChain = async (chainId) => {
    await controller.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
    return controller.provider
  },
}: {
  address: EvmAddress
  config: ReturnType<typeof createWagmiConfig>
  controller: ReturnType<typeof createProviderController>
  switchChain?(chainId: number): Promise<EIP1193Provider>
}) {
  return registerPrivyEvmConnector({
    address,
    config,
    provider: controller.provider,
    switchChain: switchPrivyChain,
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
    const connector = registerController({
      address: firstAddress,
      config,
      controller,
    })

    expect(getPrivyEvmConnector(config)).toBe(connector)
    expect(connector.id).toBe(PRIVY_EVM_CONNECTOR_ID)
    expect(connector.type).toBe('injected')
    expect(isInjectedConnector(connector)).toBe(false)
    const provider = await connector.getProvider()
    expect(provider).not.toBe(controller.provider)
    await expect(
      (provider as EIP1193Provider).request({ method: 'eth_accounts' }),
    ).resolves.toEqual([firstAddress])
    await expect(connector.isAuthorized()).resolves.toBe(true)
  })

  it('reuses the connector for the same embedded account', () => {
    const config = createWagmiConfig()
    const first = createProviderController(firstAddress)
    const second = createProviderController(firstAddress)

    const connector = registerController({
      address: firstAddress,
      config,
      controller: first,
    })
    const sameConnector = registerController({
      address: firstAddress,
      config,
      controller: second,
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
    const firstConnector = registerController({
      address: firstAddress,
      config,
      controller: first,
    })
    expect(getPrivyEvmConnector(config, secondAddress)).toBeUndefined()

    const secondConnector = registerController({
      address: secondAddress,
      config,
      controller: second,
    })

    expect(secondConnector).not.toBe(firstConnector)
    expect(getPrivyEvmConnector(config)).toBe(secondConnector)
    await expect(secondConnector.getAccounts()).resolves.toEqual([
      secondAddress,
    ])
  })

  it('uses Wagmi event handling from the injected connector', async () => {
    const config = createWagmiConfig()
    const controller = createProviderController(firstAddress)
    const connector = registerController({
      address: firstAddress,
      config,
      controller,
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
    const connector = registerController({
      address: firstAddress,
      config,
      controller,
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

  it('refreshes Privy’s provider when Wagmi switches chains', async () => {
    const config = createWagmiConfig()
    const ethereum = createProviderController(firstAddress, mainnet.id)
    const nextChain = createProviderController(firstAddress, sepolia.id)
    const switchPrivyChain = vi.fn(async () => nextChain.provider)
    const connector = registerController({
      address: firstAddress,
      config,
      controller: ethereum,
      switchChain: switchPrivyChain,
    })
    await connect(config, { connector })
    const onChange = vi.fn()
    connector.emitter.on('change', onChange)

    await switchChain(config, { chainId: sepolia.id })

    expect(switchPrivyChain).toHaveBeenCalledWith(sepolia.id)
    await expect(connector.getChainId()).resolves.toBe(sepolia.id)
    await expect(connector.getAccounts()).resolves.toEqual([firstAddress])
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ chainId: sepolia.id, connector }),
    ])
    expect(
      ethereum.request.mock.calls.map(([parameters]) => parameters.method),
    ).not.toContain('wallet_switchEthereumChain')
    expect(
      nextChain.request.mock.calls.map(([parameters]) => parameters.method),
    ).toContain('eth_chainId')

    nextChain.setAddress(secondAddress)
    nextChain.emit('accountsChanged', [secondAddress])

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ accounts: [secondAddress] }),
    )
  })

  it('unregisters only Privy and preserves another active connector', async () => {
    const mockConnector = mock({ accounts: [secondAddress] })
    const config = createWagmiConfig([mockConnector])
    const standardConnector = getConnectors(config)[0]!
    const controller = createProviderController(firstAddress)
    const privyConnector = registerController({
      address: firstAddress,
      config,
      controller,
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
