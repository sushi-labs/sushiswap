'use client'

import { State } from '@sushiswap/wagmi'
import { WagmiStoreVersionCheck } from '@sushiswap/wagmi/components'

import { QueryClientProvider } from '../providers/query-client-provider'
import { WagmiConfig } from '../providers/wagmi-provider'

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
