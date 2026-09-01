import { mock } from '@wagmi/connectors'
import {
  http,
  connect,
  createConfig,
  getConnections,
  getConnectors,
  reconnect,
  // biome-ignore lint/nursery/noRestrictedImports: this test verifies the connector-level EIP-1193 delegation
  switchChain,
} from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getPrivyEvmConnector,
  isPrivyEvmConnectorId,
  shouldReconnectPrivyEvmConnector,
  syncPrivyEvmConnector,
  toPrivyEvmConnectorId,
  unregisterPrivyEvmConnector,
} from './privy-evm-connector'

const firstAddress = '0x0000000000000000000000000000000000000001' as EvmAddress
const secondAddress = '0x0000000000000000000000000000000000000002' as EvmAddress

function createProvider(address: EvmAddress): EIP1193Provider {
  return {
    on() {},
    removeListener() {},
    request: vi.fn(async ({ method }) => {
      if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
        return [address]
      }
      if (method === 'eth_chainId') return '0x1'
      if (method === 'wallet_revokePermissions') return null
      throw new Error(`Unexpected method: ${method}`)
    }) as EIP1193Provider['request'],
  }
}

function createWallet(address: EvmAddress, provider = createProvider(address)) {
  return {
    address,
    chainId: 'eip155:1',
    async getEthereumProvider() {
      return provider
    },
    meta: {
      id: 'io.privy.wallet',
      name: 'Privy Wallet',
    },
    async switchChain() {},
    walletClientType: 'privy',
  }
}

function createWagmiConfig(
  connectors: Parameters<typeof createConfig>[0]['connectors'] = [],
) {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors,
    transports: { [mainnet.id]: http(), [sepolia.id]: http() },
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

describe('Privy EVM connector synchronization', () => {
  it('uses Privy’s address-scoped connector identity', async () => {
    const config = createWagmiConfig()
    const provider = createProvider(firstAddress)

    const connector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress, provider),
    })

    expect(connector.id).toBe(toPrivyEvmConnectorId(firstAddress))
    expect(isPrivyEvmConnectorId(connector.id)).toBe(true)
    expect(getPrivyEvmConnector(config, firstAddress)).toBe(connector)
    const connectorProvider = await connector.getProvider()
    expect(connectorProvider).not.toBe(provider)
    expect(
      await (connectorProvider as EIP1193Provider).request({
        method: 'eth_chainId',
      }),
    ).toBe('0x1')
  })

  it('reuses an existing connector for the same embedded account', async () => {
    const config = createWagmiConfig()
    const connector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress),
    })

    const sameConnector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress),
    })

    expect(sameConnector).toBe(connector)
    expect(
      getConnectors(config).filter(({ id }) => isPrivyEvmConnectorId(id)),
    ).toHaveLength(1)
  })

  it('replaces stale Privy accounts while preserving other connectors', async () => {
    const otherFactory = mock({ accounts: [firstAddress] })
    const config = createWagmiConfig([otherFactory])
    const otherConnector = getConnectors(config)[0]!
    const firstConnector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress),
    })

    const secondConnector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(secondAddress),
    })

    expect(secondConnector).not.toBe(firstConnector)
    expect(getPrivyEvmConnector(config, firstAddress)).toBeUndefined()
    expect(getPrivyEvmConnector(config, secondAddress)).toBe(secondConnector)
    expect(getConnectors(config)).toContain(otherConnector)
  })

  it('reconnects through the standard injected connector', async () => {
    const config = createWagmiConfig()
    const connector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress),
    })

    const connections = await reconnect(config, { connectors: [connector] })

    expect(connections).toEqual([
      expect.objectContaining({ accounts: [firstAddress], connector }),
    ])
  })

  it('switches through Privy’s wallet and replaces its invalidated provider', async () => {
    function createChainProvider(chainId: number): EIP1193Provider {
      return {
        on() {},
        removeListener() {},
        request: vi.fn(async ({ method }: { method: string }) => {
          if (method === 'eth_accounts' || method === 'eth_requestAccounts') {
            return [firstAddress]
          }
          if (method === 'eth_chainId') return `0x${chainId.toString(16)}`
          throw new Error(`Unexpected method: ${method}`)
        }) as EIP1193Provider['request'],
      }
    }

    let provider = createChainProvider(mainnet.id)
    const getEthereumProvider = vi.fn(async () => provider)
    const walletSwitchChain = vi.fn(async (chainId: number) => {
      provider = createChainProvider(chainId)
    })
    const wallet = {
      ...createWallet(firstAddress),
      getEthereumProvider,
      switchChain: walletSwitchChain,
    }
    const config = createWagmiConfig()
    const connector = await syncPrivyEvmConnector({ config, wallet })
    await connect(config, { connector })

    await switchChain(config, { chainId: sepolia.id })

    expect(walletSwitchChain).toHaveBeenCalledWith(sepolia.id)
    expect(getEthereumProvider).toHaveBeenCalledTimes(2)
    const refreshedProvider = (await connector.getProvider()) as EIP1193Provider
    expect(await refreshedProvider.request({ method: 'eth_chainId' })).toBe(
      `0x${sepolia.id.toString(16)}`,
    )
  })

  it('rejects malformed chain switch requests before calling Privy', async () => {
    const switchChain = vi.fn(async () => undefined)
    const wallet = {
      ...createWallet(firstAddress),
      switchChain,
    }
    const config = createWagmiConfig()
    const connector = await syncPrivyEvmConnector({ config, wallet })
    const provider = (await connector.getProvider()) as EIP1193Provider

    await expect(
      provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: 'not-a-chain' }],
      }),
    ).rejects.toThrow('invalid chain ID')
    expect(switchChain).not.toHaveBeenCalled()
  })

  it('does not register a provider that resolved after cancellation', async () => {
    const config = createWagmiConfig()
    const shouldRegister = vi.fn(() => false)

    await expect(
      syncPrivyEvmConnector({
        config,
        shouldRegister,
        wallet: createWallet(firstAddress),
      }),
    ).rejects.toThrow('registration was cancelled')
    expect(getPrivyEvmConnector(config)).toBeUndefined()
  })

  it('respects upstream reconnect and explicit-disconnect guards', async () => {
    const config = createWagmiConfig()
    await expect(shouldReconnectPrivyEvmConnector(config)).resolves.toBe(true)

    await config.storage?.setItem('recentConnectorId', 'io.privy.wallet.test')
    await config.storage?.setItem('io.privy.wallet.test.disconnected', true)
    await expect(shouldReconnectPrivyEvmConnector(config)).resolves.toBe(false)

    config.setState((state) => ({ ...state, status: 'connected' }))
    await config.storage?.removeItem('io.privy.wallet.test.disconnected')
    await expect(shouldReconnectPrivyEvmConnector(config)).resolves.toBe(false)
  })

  it('unregisters only Privy and preserves another active connection', async () => {
    const otherFactory = mock({ accounts: [secondAddress] })
    const config = createWagmiConfig([otherFactory])
    const otherConnector = getConnectors(config)[0]!
    const privyConnector = await syncPrivyEvmConnector({
      config,
      wallet: createWallet(firstAddress),
    })
    await connect(config, { connector: otherConnector })
    await connect(config, { connector: privyConnector })
    expect(getConnections(config)).toHaveLength(2)

    unregisterPrivyEvmConnector(config)

    expect(getPrivyEvmConnector(config)).toBeUndefined()
    expect(getConnections(config)).toEqual([
      expect.objectContaining({ connector: otherConnector }),
    ])
    expect(config.state.current).toBe(otherConnector.uid)
  })
})
