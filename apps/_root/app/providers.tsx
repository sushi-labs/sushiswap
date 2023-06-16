'use client'

import { Onramper } from '@sushiswap/wagmi/future/components'
import { WagmiConfig } from '../providers/WagmiProvider'
import { QueryClientProvider } from '../providers/QueryClientProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>
        <Onramper.Provider>{children}</Onramper.Provider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
