'use client'

import { faro } from '@grafana/faro-web-sdk'
import { useAppKitTheme } from '@reown/appkit/react'
import { useTheme } from 'next-themes'
import { type FC, type ReactNode, useEffect } from 'react'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { getWagmiAdapter, getWagmiInitialState } from 'src/lib/wagmi/config'
import { getAppKit } from 'src/lib/wagmi/config/appkit'
import type { PublicWagmiConfig } from 'src/lib/wagmi/config/public'
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

getAppKit()

export const WagmiProvider: FC<{
  children: ReactNode
  cookie?: string | null
}> = ({ children, cookie }) => {
  const initialState = getWagmiInitialState(cookie)

  const { forcedTheme, resolvedTheme } = useTheme()

  const { setThemeMode, setThemeVariables } = useAppKitTheme()

  const theme = forcedTheme || resolvedTheme

  /*
    biome-ignore lint/correctness/useExhaustiveDependencies:
    setThemeMode & setThemeVariables are not stable across renders.
    Including them in deps would cause this effect to run endlessly.
  */
  useEffect(() => {
    console.log('check0')
    if (!theme) return

    const themeMode = theme === 'light' ? 'light' : 'dark'
    const themeVariables = {
      '--apkt-font-family': 'var(--font-sans)',
      '--apkt-accent': '#3898FF',
    }

    setThemeMode(themeMode)
    setThemeVariables(themeVariables)
  }, [theme])

  return (
    <_WagmiProvider
      config={getWagmiAdapter().wagmiConfig as PublicWagmiConfig}
      initialState={initialState}
    >
      <div className="h-full w-full [&>div]:h-full">
        <WagmiStoreVersionCheck>
          <WagmiTrackers />
          {children}
        </WagmiStoreVersionCheck>
      </div>
    </_WagmiProvider>
  )
}
