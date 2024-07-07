'use client'

import { BaseProviders } from '@sushiswap/ui'
import { QueryClientProvider } from '../providers/query-client-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseProviders>
      <QueryClientProvider>{children}</QueryClientProvider>
    </BaseProviders>
  )
}
