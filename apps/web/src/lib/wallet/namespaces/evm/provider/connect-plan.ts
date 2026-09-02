import type { Config, Connection, Connector } from '@wagmi/core'
import type { Wallet } from 'src/lib/wallet/types'

/**
 * Wagmi's `getConnections` returns a cached array while the status is
 * `'reconnecting'`, which on a fresh page load is empty. Read the store so
 * connections hydrated from storage are visible during a restore: they must
 * still be cleared before another wallet connects, or `connect` would merge
 * around them and a later disconnect would promote one to the active
 * connection.
 */
export function getEvmConnections(config: Config): Connection[] {
  return [...config.state.connections.values()]
}

/** The wallet-list identity Sushi derives from a Wagmi connector. */
export function toEvmWalletId(connectorId: string): string {
  return `evm:${connectorId.toLowerCase()}`
}

/**
 * The registered connector backing a wallet-list entry.
 *
 * Entries built from live connectors carry a `uid`, but statically defined
 * ones (Privy, Safe, WalletConnect, ...) cannot, so identity is resolved
 * through the connector registry instead. Returns undefined when the wallet
 * has no registered connector yet and its adapter has to create one.
 */
export function findEvmWalletConnector(
  config: Config,
  wallet: Wallet,
): Connector | undefined {
  return config.connectors.find(
    (connector) => toEvmWalletId(connector.id) === wallet.id,
  )
}

/**
 * The account of a live, current connection for exactly this connector.
 *
 * Read from Wagmi rather than from React state so a re-click cannot act on a
 * stale render, and so a hydrated connection still being restored (whose
 * connector is a serialized stub from the previous page load) is not mistaken
 * for an established one.
 */
export function getConnectedEvmAccount(
  config: Config,
  connector: Connector | undefined,
): string | undefined {
  if (!connector || config.state.status !== 'connected') return undefined
  if (config.state.current !== connector.uid) return undefined
  return config.state.connections.get(connector.uid)?.accounts[0]
}
