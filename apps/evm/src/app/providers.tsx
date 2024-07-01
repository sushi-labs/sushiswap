'use client'

import '@rainbow-me/rainbowkit/styles.css'

import 'sushi/bigint-serializer'

import { BaseProviders, OnramperProvider } from '@sushiswap/ui'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

export function Providers({
  children,
  cookie,
}: { children: React.ReactNode; cookie: string | null }) {
  return (
    <BaseProviders>
      <OnramperProvider>
        <QueryClientProvider>
          <WagmiConfig cookie={cookie}>
            <WagmiStoreVersionCheck>{children}</WagmiStoreVersionCheck>
          </WagmiConfig>
        </QueryClientProvider>
      </OnramperProvider>
    </BaseProviders>
  )
}
