import {
  coinbaseWallet,
  metaMask,
  safe,
  walletConnect,
} from '@wagmi/connectors'
import type { CreateConnectorFn } from '@wagmi/core'

/**
 * Canonical factories for non-discoverable connectors, keyed by lowercase
 * connector id. Both the click-path (wallet adapters) and the reload-restore
 * path (persisted connectors) must use these so connector options never
 * drift apart.
 */
export const evmConnectorFactories: Record<string, () => CreateConnectorFn> = {
  coinbasewalletsdk: () =>
    coinbaseWallet({
      preference: { options: 'all', telemetry: false },
    }),
  metamasksdk: () => metaMask(),
  safe: () => safe(),
  walletconnect: () =>
    walletConnect({
      projectId: '3f44629277b155ef0caebf3dc705c4ba',
    }),
}
