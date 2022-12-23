import '@sushiswap/ui13/index.css'

import RootLayout from '@sushiswap/ui13/components/RootLayout'
import React from 'react'

import { Header } from '../ui/Header'
import { PersistQueryClientProvider } from '../ui/PersistQueryClientProvider'
import { WagmiProvider } from '../ui/WagmiProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <PersistQueryClientProvider>
        <RootLayout>
          <Header />
          {children}
        </RootLayout>
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
