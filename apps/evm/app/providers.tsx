'use client'

import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>{children}</QueryClientProvider>
    </WagmiConfig>
  )
}
