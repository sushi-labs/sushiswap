import { WALLET_CONNECT_PROJECT_ID } from 'src/lib/wagmi/config/connector-options'
import type { LazyConnectorDefinition } from 'src/lib/wagmi/config/connector-utils'

export const walletConnectConnectorDefinition = {
  id: 'walletConnect',
  name: 'WalletConnect',
  type: 'walletConnect',
  async load() {
    const { walletConnect } = await import('@wagmi/connectors')
    return walletConnect({
      projectId: WALLET_CONNECT_PROJECT_ID,
    })
  },
} satisfies LazyConnectorDefinition
