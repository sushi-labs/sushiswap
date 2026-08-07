'use client'

import type { ReactNode } from 'react'
import { WalletProvider as WalletStateProvider } from 'src/lib/wallet'
import { PrivyProvider } from './privy-provider'
import { WagmiProvider } from './wagmi-provider'

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider>
      <WagmiProvider>
        <WalletStateProvider>{children}</WalletStateProvider>
      </WagmiProvider>
    </PrivyProvider>
  )
}
