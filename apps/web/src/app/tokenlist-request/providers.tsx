'use client'

import { BaseProviders } from '@sushiswap/ui'
import { OnramperProvider } from 'src/lib/onramper/components/onramper-provider'
import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiProvider } from '../../providers/wagmi-provider'

export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <QueryClientProvider>
        <WagmiProvider cookie={cookie}>
          <OnramperProvider>{children}</OnramperProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </BaseProviders>
  )
}
