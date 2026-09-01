import {
  coinbaseWallet,
  metaMask,
  safe,
  walletConnect,
} from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'

type EvmConnectorFactoryId =
  | 'coinbaseWalletSDK'
  | 'metaMaskSDK'
  | 'safe'
  | 'walletConnect'

function ignoreSetupErrors(connectorFn: CreateConnectorFn): CreateConnectorFn {
  return (config) => {
    const connector = connectorFn(config)
    const setup = connector.setup

    return {
      ...connector,
      async setup() {
        try {
          await setup?.call(this)
        } catch {}
      },
    }
  }
}

/**
 * Canonical connector factories. Both the click path (wallet adapters) and
 * the reload-restore path (for non-discoverable connectors) use these so
 * connector options never drift apart.
 */
export const evmConnectorFactories = {
  coinbaseWalletSDK: () =>
    coinbaseWallet({
      preference: { options: 'all', telemetry: false },
    }),
  metaMaskSDK: () => ignoreSetupErrors(metaMask()),
  safe: () => safe(),
  walletConnect: () =>
    walletConnect({
      projectId: '3f44629277b155ef0caebf3dc705c4ba',
    }),
} satisfies Record<EvmConnectorFactoryId, () => CreateConnectorFn>

const evmConnectorFactoryIds = new Map<string, EvmConnectorFactoryId>([
  ['coinbasewalletsdk', 'coinbaseWalletSDK'],
  ['metamasksdk', 'metaMaskSDK'],
  ['safe', 'safe'],
  ['walletconnect', 'walletConnect'],
])

export function getEvmConnectorFactory(
  connectorId: string,
): (() => CreateConnectorFn) | undefined {
  const factoryId = evmConnectorFactoryIds.get(connectorId.toLowerCase())
  return factoryId ? evmConnectorFactories[factoryId] : undefined
}
