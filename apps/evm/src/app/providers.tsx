'use client'

import { WagmiStoreVersionCheck } from '@sushiswap/wagmi/components'

import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>
        <WagmiStoreVersionCheck>{children}</WagmiStoreVersionCheck>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
