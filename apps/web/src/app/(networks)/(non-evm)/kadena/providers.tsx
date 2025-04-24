'use client'

import { eckoAdapter } from '@kadena/wallet-adapter-ecko'
import { KadenaWalletProvider as KadenaWalletProviderReact } from '@kadena/wallet-adapter-react'
import { KadenaWalletProvider } from './kadena-wallet-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <KadenaWalletProviderReact adapters={[eckoAdapter()]}>
      <KadenaWalletProvider>{children}</KadenaWalletProvider>
    </KadenaWalletProviderReact>
  )
}
