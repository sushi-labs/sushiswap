'use client'

import { eckoAdapter } from '@kadena/wallet-adapter-ecko'
import { createWalletConnectAdapter } from '@kadena/wallet-adapter-walletconnect'

import { KadenaWalletProvider as KadenaWalletProviderReact } from '@kadena/wallet-adapter-react'
import { KadenaWalletProvider } from './kadena-wallet-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const walletConnectAdapter = createWalletConnectAdapter({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  })
  return (
    <KadenaWalletProviderReact adapters={[eckoAdapter(), walletConnectAdapter]}>
      <KadenaWalletProvider>{children}</KadenaWalletProvider>
    </KadenaWalletProviderReact>
  )
}
