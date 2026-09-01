'use client'

import { type ReactNode, useState } from 'react'
import { hasPersistedConnectorMatching } from 'src/lib/wagmi/config/persisted-connectors'
import { isPrivyEvmConnectorId } from 'src/lib/wallet/privy/privy-evm-connector'
import { WalletProvider as WalletStateProvider } from 'src/lib/wallet/provider/wallet-provider'
import { PrivyRuntimeGate } from './privy-runtime-gate'
import { WagmiProvider } from './wagmi-provider'

export function WalletProvider({ children }: { children: ReactNode }) {
  // Snapshot this before Wagmi hydration mutates persisted connection state.
  // Privy registers its connector only after its lazy runtime restores, so
  // Wagmi must skip mount reconnection while Privy retains the original intent.
  const [shouldReconnectPrivyEvm] = useState(() =>
    hasPersistedConnectorMatching(isPrivyEvmConnectorId),
  )

  return (
    <WagmiProvider shouldReconnectPrivyEvm={shouldReconnectPrivyEvm}>
      <WalletStateProvider>{children}</WalletStateProvider>
      <PrivyRuntimeGate shouldReconnectPrivyEvm={shouldReconnectPrivyEvm} />
    </WagmiProvider>
  )
}
