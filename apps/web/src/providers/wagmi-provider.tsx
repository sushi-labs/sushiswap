'use client'

import { faro } from '@grafana/faro-web-sdk'
import { type FC, type ReactNode, useEffect } from 'react'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { getWagmiConfig, getWagmiInitialState } from 'src/lib/wagmi/config'
import { WalletProvider } from 'src/lib/wallet'
import { WagmiProvider as _WagmiProvider, useConnection } from 'wagmi'

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
  cookie?: string | null
}> = ({ children, cookie }) => {
  const initialState = getWagmiInitialState(cookie)

  return (
    <_WagmiProvider config={getWagmiConfig()} initialState={initialState}>
      <div className="h-full w-full [&>div]:h-full">
        <WalletProvider>
          <WagmiStoreVersionCheck>
            <WagmiTrackers />
            {children}
          </WagmiStoreVersionCheck>
        </WalletProvider>
      </div>
    </_WagmiProvider>
  )
}
