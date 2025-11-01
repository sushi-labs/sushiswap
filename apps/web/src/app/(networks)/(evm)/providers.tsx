'use client'

import { TurnstileProvider } from 'src/app/_common/turnstile/turnstile-provider'
import { BalanceProvider } from './_common/ui/balance-provider/balance-provider'
import { PriceProvider } from './_common/ui/price-provider/price-provider/price-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TurnstileProvider>
      <PriceProvider>
        <BalanceProvider>{children}</BalanceProvider>
      </PriceProvider>
    </TurnstileProvider>
  )
}
