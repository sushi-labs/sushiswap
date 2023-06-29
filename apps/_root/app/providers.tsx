'use client'

import { Onramper } from '@sushiswap/wagmi/future/components'

import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>
        <Onramper.Provider>{children}</Onramper.Provider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
