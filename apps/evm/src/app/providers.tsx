'use client'

import { State } from 'wagmi'

import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

import '../lib/serialization'

export function Providers({
  children,
  initialWagmiState,
}: { children: React.ReactNode; initialWagmiState?: State | undefined }) {
  return (
    <WagmiConfig initialState={initialWagmiState}>
      <QueryClientProvider>
        <WagmiStoreVersionCheck>{children}</WagmiStoreVersionCheck>
      </QueryClientProvider>
    </WagmiConfig>
  )
}
