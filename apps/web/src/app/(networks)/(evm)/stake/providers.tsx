'use client'

import { SplashController } from '@sushiswap/ui'
import { SushiBarProvider } from './_ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SplashController>
      <SushiBarProvider>{children}</SushiBarProvider>
    </SplashController>
  )
}
