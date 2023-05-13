'use client'

import { Onramper } from '@sushiswap/wagmi/future/components'
import { ThemeProvider } from '@sushiswap/ui'
import { WagmiConfig } from '../components/WagmiConfig'
import { QueryClientProvider } from '../components/QueryClientProvider'

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
