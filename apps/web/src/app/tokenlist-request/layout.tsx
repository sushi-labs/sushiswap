import React from 'react'

import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiProvider } from '../../providers/wagmi-provider'
import { Header } from './header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <Header />
      <WagmiProvider>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
