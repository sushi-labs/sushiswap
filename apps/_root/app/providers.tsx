'use client'

import { Onramper } from '@sushiswap/wagmi/future/components'
import { WagmiConfig } from '../providers/wagmi-provider'
import { QueryClientProvider } from '../providers/query-client-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>
        <Onramper.Provider>{children}</Onramper.Provider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
