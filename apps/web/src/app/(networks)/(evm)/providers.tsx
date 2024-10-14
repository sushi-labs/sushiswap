'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { BalanceProvider } from './_common/ui/balance-provider/balance-provider'
import { PriceProvider } from './_common/ui/price-provider/price-provider/price-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PriceProvider>
      <BalanceProvider>{children}</BalanceProvider>
    </PriceProvider>
  )
}
