import '@sushiswap/ui13/index.css'

import RootLayout from '@sushiswap/ui13/components/RootLayout'
import { WagmiConfig } from '@sushiswap/wagmi13/WagmiConfig'
import React from 'react'

import { Header } from '../ui/Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <RootLayout>
        <Header />
        {children}
      </RootLayout>
    </WagmiConfig>
  )
}
