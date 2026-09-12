'use client'

import { SplashController } from '@sushiswap/ui'
import type { ReactNode } from 'react'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { BalanceProvider } from '~evm/_common/ui/balance-provider/balance-provider'

export function SwapProviders({ children }: { children: ReactNode }) {
  return (
    <SplashController>
      <CheckerProvider>
        <BalanceProvider>{children}</BalanceProvider>
      </CheckerProvider>
    </SplashController>
  )
}
