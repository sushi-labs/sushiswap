'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { faro } from '@grafana/faro-web-sdk'
import {
  type DisclaimerComponent,
  RainbowKitProvider,
  type Theme,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
  midnightTheme as rainbowMidnightTheme,
} from '@rainbow-me/rainbowkit'
import { useIsMounted } from '@sushiswap/hooks'
import { useTheme } from 'next-themes'
import { type FC, type ReactNode, useEffect, useMemo } from 'react'
import { WagmiStoreVersionCheck } from 'src/lib/wagmi/components/wagmi-store-version-check'
import { getWagmiConfig, getWagmiInitialState } from 'src/lib/wagmi/config'
import { WagmiProvider as _WagmiProvider, useAccount } from 'wagmi'

const darkTheme: Theme = {
  ...rainbowDarkTheme({
    borderRadius: 'medium',
    overlayBlur: 'small',
  }),
  colors: {
    ...rainbowDarkTheme().colors,
    modalBackground: '#1e293b',
    modalBackdrop: '#00000019',
    modalBorder: '#00000000',
  },
  fonts: {
    body: 'var(--font-sans)',
  },
}

const lightTheme: Theme = {
  ...rainbowLightTheme({
    borderRadius: 'medium',
    overlayBlur: 'small',
  }),
  colors: {
    ...rainbowLightTheme().colors,
    modalBackground: '#ffffff',
    modalBackdrop: '#00000019',
    modalBorder: '#00000000',
  },
  fonts: {
    body: 'var(--font-sans)',
  },
}

const midnightTheme: Theme = {
  ...rainbowMidnightTheme({}),
}

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to Sushi Labs{"' "}
    <Link href="/legal/terms-of-service">Terms of Service</Link> and{' '}
    <Link href="/legal/privacy-policy">Privacy Policy</Link>
  </Text>
)

export const WagmiProvider: FC<{
  children: ReactNode
  cookie?: string | null
}> = ({ children, cookie }) => {
  const initialState = getWagmiInitialState(cookie)
  const isMounted = useIsMounted()

  const { forcedTheme, resolvedTheme } = useTheme()

  const theme = forcedTheme || resolvedTheme

  const rainbowKitTheme = useMemo(() => {
    if (!isMounted) return lightTheme

    if (theme === 'dark') {
      return darkTheme
    }

    if (theme === 'black') {
      return midnightTheme
    }

    return lightTheme
  }, [theme, isMounted])

  const { address, chainId } = useAccount()

  useEffect(() => {
    if (!address || !faro.api) return
    faro.api.pushEvent('address-change', { address })
  }, [address])

  useEffect(() => {
    if (!chainId || !faro.api) return
    faro.api.pushEvent('chain-change', { chainId: String(chainId) })
  }, [chainId])

  return (
    <_WagmiProvider config={getWagmiConfig()} initialState={initialState}>
      <div className="h-full w-full [&>div]:h-full">
        <RainbowKitProvider
          modalSize="compact"
          theme={rainbowKitTheme}
          appInfo={{ disclaimer: Disclaimer }}
        >
          <WagmiStoreVersionCheck>{children}</WagmiStoreVersionCheck>
        </RainbowKitProvider>
      </div>
    </_WagmiProvider>
  )
}
