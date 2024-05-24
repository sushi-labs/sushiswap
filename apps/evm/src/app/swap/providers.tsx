'use client'

import { ThemeProvider } from '@sushiswap/ui'
import { CheckerProvider } from '@sushiswap/wagmi/systems/Checker/Provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CheckerProvider>{children}</CheckerProvider>
    </ThemeProvider>
  )
}
