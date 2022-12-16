import '@sushiswap/ui13/index.css'

import RootLayout from '@sushiswap/ui13/components/RootLayout'
import React from 'react'

import { Header } from '../ui/Header'
import { WagmiProvider } from '../ui/WagmiProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <RootLayout>
        <Header />
        {children}
      </RootLayout>
    </WagmiProvider>
  )
}
