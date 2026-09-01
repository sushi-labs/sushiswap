'use client'

import type { ReactNode } from 'react'
import { WalletProvider as WalletStateProvider } from 'src/lib/wallet/provider/wallet-provider'
import { PrivyRuntimeGate } from './privy-runtime-gate'
import { WagmiProvider } from './wagmi-provider'

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider>
      <WalletStateProvider>{children}</WalletStateProvider>
      <PrivyRuntimeGate />
    </WagmiProvider>
  )
}
