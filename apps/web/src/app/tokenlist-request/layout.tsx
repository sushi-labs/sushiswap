import React from 'react'

import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiConfig } from '../../providers/wagmi-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <WagmiConfig>{children}</WagmiConfig>
    </QueryClientProvider>
  )
}
