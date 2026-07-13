'use client'

import { faro } from '@grafana/faro-web-sdk'
import { WagmiProvider as _WagmiProvider } from '@privy-io/wagmi'
import { type FC, type ReactNode, useEffect, useState } from 'react'
import { WagmiPersistedStateProvider } from 'src/lib/wagmi/components/wagmi-persisted-state-provider'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { useConnection } from 'wagmi'
import { QueryClientProvider } from './query-client-provider'

const WagmiTrackers = () => {
  const { address, chainId } = useConnection()

  useEffect(() => {
    if (!address || !faro.api) return
    faro.api.pushEvent('address-change', { address })
  }, [address])

  useEffect(() => {
    if (!chainId || !faro.api) return
    faro.api.pushEvent('chain-change', { chainId: String(chainId) })
  }, [chainId])

  return null
}

export const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [persistedCookie] = useState(() =>
    typeof document === 'undefined' ? undefined : document.cookie,
  )

  return (
    <QueryClientProvider>
      <WagmiPersistedStateProvider cookie={persistedCookie}>
        <_WagmiProvider config={getWagmiConfig()}>
          <div className="h-full w-full [&>div]:h-full">
            <WagmiStoreVersionCheck>
              <WagmiTrackers />
              {children}
            </WagmiStoreVersionCheck>
          </div>
        </_WagmiProvider>
      </WagmiPersistedStateProvider>
    </QueryClientProvider>
  )
}
