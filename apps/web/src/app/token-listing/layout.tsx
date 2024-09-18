import React from 'react'

import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiProvider } from '../../providers/wagmi-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <WagmiProvider>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
