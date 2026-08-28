import { injected } from '@wagmi/connectors'
import type { Config, Connector } from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider } from 'viem'

/**
 * Adapted from `@privy-io/wagmi@4.0.16`'s `useSyncPrivyWallets`.
 *
 * Copyright 2022-2023 Horkos, Inc. Licensed under Apache-2.0. See
 * `privy-wagmi-license.txt` in this directory. Sushi's adaptation keeps
 * non-Privy connectors registered and leaves Privy's React runtime lazy.
 */

export const PRIVY_EVM_CONNECTOR_ID = 'io.privy.wallet'
export const PRIVY_EVM_CONNECTOR_NAME = 'Email'

export interface PrivyEvmConnectorWallet {
  address: EvmAddress
  chainId: string
  getEthereumProvider(): Promise<EIP1193Provider>
  meta: {
    icon?: string
    id: string
    name: string
  }
  walletClientType: string
}

export function toPrivyEvmConnectorId(address: EvmAddress): string {
  return `${PRIVY_EVM_CONNECTOR_ID}.${address}`
}

export function isPrivyEvmConnectorId(connectorId: string): boolean {
  return connectorId.toLowerCase().startsWith(`${PRIVY_EVM_CONNECTOR_ID}.`)
}

export function getPrivyEvmConnector(
  config: Config,
  address?: EvmAddress,
): Connector | undefined {
  if (address) {
    const connectorId = toPrivyEvmConnectorId(address)
    return config.connectors.find(
      (connector) => connector.id.toLowerCase() === connectorId.toLowerCase(),
    )
  }
  return config.connectors.find((connector) =>
    isPrivyEvmConnectorId(connector.id),
  )
}

/** Mirrors Privy 4.0.16's guards around automatic Wagmi reconnection. */
export async function shouldReconnectPrivyEvmConnector(
  config: Config,
): Promise<boolean> {
  if (config.state.status === 'connected') return false

  const recentConnectorId = await config.storage?.getItem('recentConnectorId')
  if (!recentConnectorId) return true
  return !(await config.storage?.getItem(`${recentConnectorId}.disconnected`))
}

/** Register the current Privy wallet using Wagmi's standard injected adapter. */
export async function syncPrivyEvmConnector({
  config,
  shouldRegister = () => true,
  wallet,
}: {
  config: Config
  shouldRegister?: () => boolean
  wallet: PrivyEvmConnectorWallet
}): Promise<Connector> {
  const connectorId = toPrivyEvmConnectorId(wallet.address)
  const existingConnector = config.connectors.find(
    (connector) => connector.id.toLowerCase() === connectorId.toLowerCase(),
  )
  if (existingConnector) return existingConnector

  const provider = await wallet.getEthereumProvider()
  if (!shouldRegister()) {
    throw new Error('Privy EVM connector registration was cancelled')
  }
  const connector = config._internal.connectors.setup(
    injected({
      target: {
        id: connectorId,
        name: wallet.meta.name || PRIVY_EVM_CONNECTOR_NAME,
        icon: wallet.meta.icon,
        provider,
      },
    }),
  )

  // Privy's package owns every connector in its Wagmi config and replaces the
  // entire registry. Sushi also supports independently managed connectors, so
  // retain those while replacing stale Privy wallet instances.
  config._internal.connectors.setState((connectors) => [
    ...connectors.filter((candidate) => !isPrivyEvmConnectorId(candidate.id)),
    connector,
  ])
  return connector
}

/** Remove Privy's connector and connection without disturbing another wallet. */
export function unregisterPrivyEvmConnector(config: Config): void {
  if (
    !config.connectors.some((connector) => isPrivyEvmConnectorId(connector.id))
  ) {
    return
  }

  config._internal.connectors.setState((connectors) =>
    connectors.filter((connector) => !isPrivyEvmConnectorId(connector.id)),
  )
  config.setState((state) => {
    const connections = new Map(
      [...state.connections].filter(
        ([, connection]) => !isPrivyEvmConnectorId(connection.connector.id),
      ),
    )
    const current =
      state.current && connections.has(state.current)
        ? state.current
        : (connections.keys().next().value ?? null)

    return {
      ...state,
      connections,
      current,
      status: connections.size > 0 ? 'connected' : 'disconnected',
    }
  })
}
