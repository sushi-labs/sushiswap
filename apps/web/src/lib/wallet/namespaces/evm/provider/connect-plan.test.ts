import { mock } from '@wagmi/connectors'
import {
  http,
  type Config,
  type Connection,
  type CreateConnectorFn,
  connect,
  createConfig,
  createStorage,
  disconnect,
  getConnections,
  noopStorage,
} from '@wagmi/core'
import { createLazyConnector } from 'src/lib/wagmi/config/connector-utils'
import { privyEvmConnector } from 'src/lib/wallet/privy/privy-evm-connector'
import type { Wallet } from 'src/lib/wallet/types'
import { mainnet } from 'viem/chains'
import { describe, expect, it } from 'vitest'
import { EVM_WALLETS, EvmAdapterId } from '../config'
import {
  findEvmWalletConnector,
  getConnectedEvmAccount,
  getEvmConnections,
  toEvmWalletId,
} from './connect-plan'

const account = '0x0000000000000000000000000000000000000001'

function getWallet(id: string): Wallet {
  const wallet = EVM_WALLETS.find((candidate) => candidate.id === id)
  if (!wallet) throw new Error(`Unknown wallet ${id}`)
  return wallet
}

function createTestConfig(connectors: CreateConnectorFn[]): Config {
  return createConfig({
    chains: [mainnet],
    connectors,
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: noopStorage }),
    transports: { [mainnet.id]: http() },
  })
}

/** A connector registered under an id Sushi's wallet list uses. */
function createNamedConnector(id: string, name: string): CreateConnectorFn {
  return createLazyConnector({
    id,
    load: async () => mock({ accounts: [account] }),
    name,
    type: 'test',
  })
}

describe('EVM wallet identity', () => {
  // Registry lookup replaces a `uid` plumbed through the wallet list, so every
  // listed wallet's id must line up with the id its connector reports.
  it.each([
    ['evm:io.privy.wallet', 'io.privy.wallet'],
    ['evm:safe', 'safe'],
    ['evm:walletconnect', 'walletConnect'],
    ['evm:coinbasewalletsdk', 'coinbaseWalletSDK'],
    ['evm:injected', 'injected'],
    ['evm:io.rabby', 'io.rabby'],
  ])('maps %s to the %s connector', (walletId, connectorId) => {
    expect(toEvmWalletId(connectorId)).toBe(walletId)
    expect(getWallet(walletId).id).toBe(walletId)
  })

  it('has no registered connector for MetaMask, whose SDK id differs', () => {
    // Pre-existing behavior: the entry is keyed by the extension's RDNS while
    // `metaMask()` reports `metaMaskSDK`, so its adapter creates the connector
    // on demand instead of resolving one from the registry.
    expect(toEvmWalletId('metaMaskSDK')).not.toBe(
      getWallet('evm:io.metamask').id,
    )
    expect(getWallet('evm:io.metamask').adapterId).toBe(EvmAdapterId.MetaMask)

    const config = createTestConfig([privyEvmConnector()])
    expect(
      findEvmWalletConnector(config, getWallet('evm:io.metamask')),
    ).toBeUndefined()
  })

  it('resolves statically defined wallets that carry no uid', () => {
    const config = createTestConfig([
      privyEvmConnector(),
      createNamedConnector('safe', 'Safe'),
    ])

    for (const walletId of ['evm:io.privy.wallet', 'evm:safe']) {
      const wallet = getWallet(walletId)
      expect(wallet.uid).toBeUndefined()
      expect(
        toEvmWalletId(findEvmWalletConnector(config, wallet)?.id ?? ''),
      ).toBe(walletId)
    }
  })

  it('reports the account only for the live current connection', async () => {
    const config = createTestConfig([createNamedConnector('safe', 'Safe')])
    const target = findEvmWalletConnector(config, getWallet('evm:safe'))
    if (!target) throw new Error('Connector was not registered')

    expect(getConnectedEvmAccount(config, target)).toBeUndefined()
    expect(getConnectedEvmAccount(config, undefined)).toBeUndefined()

    await connect(config, { connector: target })
    expect(getConnectedEvmAccount(config, target)).toBe(account)

    await disconnect(config, { connector: target })
    expect(getConnectedEvmAccount(config, target)).toBeUndefined()
  })

  it('sees a restoring connection that Wagmi hides, and never treats it as established', () => {
    const config = createTestConfig([createNamedConnector('safe', 'Safe')])
    const target = findEvmWalletConnector(config, getWallet('evm:safe'))
    if (!target) throw new Error('Connector was not registered')

    // Prime Wagmi's cached connection array while disconnected.
    expect(getConnections(config)).toEqual([])

    // A hydrated connection carries the previous page load's serialized
    // connector, so its uid never matches the live one.
    const stub = {
      id: target.id,
      name: target.name,
      type: target.type,
      uid: 'stale-uid',
    } as unknown as Connection['connector']
    config.setState((state) => ({
      ...state,
      connections: new Map([
        [
          stub.uid,
          { accounts: [account], chainId: mainnet.id, connector: stub },
        ],
      ]),
      current: stub.uid,
      status: 'reconnecting',
    }))

    // Wagmi's own accessor hides it, which is why the provider reads the store.
    expect(getConnections(config)).toEqual([])
    expect(getEvmConnections(config)).toHaveLength(1)

    // Not established: the uid belongs to no registered connector.
    expect(getConnectedEvmAccount(config, target)).toBeUndefined()
    // And the disconnect loop's uid check does not skip it.
    expect(
      getEvmConnections(config).filter(
        (connection) => connection.connector.uid !== target.uid,
      ),
    ).toHaveLength(1)
  })
})
