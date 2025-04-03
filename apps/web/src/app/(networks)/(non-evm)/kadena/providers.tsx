'use client'

import { WalletAdaptersProvider } from './wallet-adapters-provider'
import { WalletConnectProvider } from './wallet-connect-provider'
import { WalletProvider } from './wallet-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <WalletConnectProvider>
        <WalletAdaptersProvider>{children}</WalletAdaptersProvider>
      </WalletConnectProvider>
    </WalletProvider>
  )
}
