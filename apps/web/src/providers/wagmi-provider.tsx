'use client'

import { faro } from '@grafana/faro-web-sdk'
import { type FC, type ReactNode, useEffect } from 'react'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { WagmiProvider as _WagmiProvider, useConnection } from 'wagmi'
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

export const WagmiProvider: FC<{
  children: ReactNode
  shouldReconnectPrivyEvm?: boolean
}> = ({ children, shouldReconnectPrivyEvm = false }) => {
  // No `initialState`: the connection is restored client-side from Wagmi's
  // local storage. Reading connection state on the server would make every
  // route below this provider request-bound and block partial prerendering.
  return (
    <QueryClientProvider>
      <_WagmiProvider
        config={getWagmiConfig()}
        reconnectOnMount={!shouldReconnectPrivyEvm}
      >
        <div className="h-full w-full [&>div]:h-full">
          <WagmiStoreVersionCheck>
            <WagmiTrackers />
            {children}
          </WagmiStoreVersionCheck>
        </div>
      </_WagmiProvider>
    </QueryClientProvider>
  )
}
