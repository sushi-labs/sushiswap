'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { BaseProviders, OnramperProvider } from '@sushiswap/ui'
import { WagmiSentry } from 'src/lib/wagmi/components/wagmi-sentry'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { QueryClientProvider } from '../../providers/query-client-provider'
import { WagmiConfig } from '../../providers/wagmi-provider'

export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <OnramperProvider>
        <QueryClientProvider>
          <WagmiConfig cookie={cookie}>
            <WagmiSentry>
              <WagmiStoreVersionCheck>{children}</WagmiStoreVersionCheck>
            </WagmiSentry>
          </WagmiConfig>
        </QueryClientProvider>
      </OnramperProvider>
    </BaseProviders>
  )
}
