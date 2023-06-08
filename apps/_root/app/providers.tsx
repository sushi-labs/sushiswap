'use client'

import { Onramper } from '@sushiswap/wagmi/future/components'
import { ThemeProvider } from '@sushiswap/ui'
import { WagmiConfig, QueryClientProvider } from '../providers'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig>
      <QueryClientProvider>
        <ThemeProvider>
          <Onramper.Provider>{children}</Onramper.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
