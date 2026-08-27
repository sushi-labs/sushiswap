import { injected } from '@wagmi/connectors'
import type { Config, Connector } from '@wagmi/core'
import type { EvmAddress } from 'sushi/evm'
import type { EIP1193Provider } from 'viem'
import { createPrivyEvmProvider } from './privy-evm-provider'

export const PRIVY_EVM_CONNECTOR_ID = 'io.privy'
export const PRIVY_EVM_CONNECTOR_NAME = 'Email'

type PrivyEvmConnectorRegistration = {
  address: EvmAddress
  connector: Connector
}

const registrations = new WeakMap<Config, PrivyEvmConnectorRegistration>()

export function getPrivyEvmConnector(
  config: Config,
  address?: EvmAddress,
): Connector | undefined {
  if (address) {
    const registration = registrations.get(config)
    if (registration?.address.toLowerCase() !== address.toLowerCase()) {
      return undefined
    }
    return config.connectors.find(
      (connector) => connector.uid === registration.connector.uid,
    )
  }
  return config.connectors.find(
    (connector) => connector.id === PRIVY_EVM_CONNECTOR_ID,
  )
}

/**
 * Adapted from `@privy-io/wagmi`'s `useSyncPrivyWallets`: wrap the real
 * app-scoped Privy provider in Wagmi's standard injected connector, then add
 * the configured connector to Wagmi's live connector registry.
 */
export function registerPrivyEvmConnector({
  address,
  config,
  provider,
  switchChain,
}: {
  address: EvmAddress
  config: Config
  provider: EIP1193Provider
  switchChain(chainId: number): Promise<EIP1193Provider>
}): Connector {
  const registration = registrations.get(config)
  if (
    registration?.address.toLowerCase() === address.toLowerCase() &&
    config.connectors.some(
      (connector) => connector.uid === registration.connector.uid,
    )
  ) {
    return registration.connector
  }

  unregisterPrivyEvmConnector(config)

  const wagmiProvider = createPrivyEvmProvider({ provider, switchChain })

  const connector = config._internal.connectors.setup(
    injected({
      // Privy authentication is the source of truth for disconnects, so Wagmi
      // does not need an additional local `*.disconnected` shim.
      shimDisconnect: false,
      target: {
        id: PRIVY_EVM_CONNECTOR_ID,
        name: PRIVY_EVM_CONNECTOR_NAME,
        provider: wagmiProvider,
      },
    }),
  )

  config._internal.connectors.setState((connectors) => [
    ...connectors.filter(
      (candidate) => candidate.id !== PRIVY_EVM_CONNECTOR_ID,
    ),
    connector,
  ])
  registrations.set(config, { address, connector })
  return connector
}

/** Remove only Privy's connector and connection, preserving every other wallet. */
export function unregisterPrivyEvmConnector(config: Config): void {
  const connectors = config.connectors.filter(
    (connector) => connector.id === PRIVY_EVM_CONNECTOR_ID,
  )
  if (connectors.length === 0) {
    registrations.delete(config)
    return
  }

  for (const connector of connectors) {
    connector.emitter.off('connect', config._internal.events.connect)
    connector.emitter.off('change', config._internal.events.change)
    connector.emitter.off('disconnect', config._internal.events.disconnect)
  }

  config._internal.connectors.setState((current) =>
    current.filter((connector) => connector.id !== PRIVY_EVM_CONNECTOR_ID),
  )
  config.setState((state) => {
    const connections = new Map(
      [...state.connections].filter(
        ([, connection]) => connection.connector.id !== PRIVY_EVM_CONNECTOR_ID,
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
  registrations.delete(config)
}
