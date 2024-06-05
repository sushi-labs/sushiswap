'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { CheckerProvider } from '@sushiswap/wagmi/systems/Checker/Provider'
import { useSkaleEuropaFaucet } from 'src/lib/hooks'

export function Providers({ children }: { children: React.ReactNode }) {
  useSkaleEuropaFaucet()
  return (
    <ThemeProvider>
      <CheckerProvider>{children}</CheckerProvider>
    </ThemeProvider>
  )
}
