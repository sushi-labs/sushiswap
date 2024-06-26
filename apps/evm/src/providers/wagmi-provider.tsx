'use client'

import {
  DisclaimerComponent,
  RainbowKitProvider,
  type Theme,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { useTheme } from 'next-themes'
import { type FC, type ReactNode, useMemo } from 'react'
import { getWagmiInitialState, wagmiConfig } from 'src/lib/wagmi/config'
import { WagmiProvider } from 'wagmi'

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
    body: 'Inter',
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
}

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to Sushi Labs{"' "}
    <Link href="/terms-of-service">Terms of Service</Link> and{' '}
    <Link href="/privacy-policy">Privacy Policy</Link>
  </Text>
)

export const WagmiConfig: FC<{
  children: ReactNode
  cookie: string | null
}> = ({ children, cookie }) => {
  const initialState = getWagmiInitialState(cookie)

  const { theme } = useTheme()

  const rainbowKitTheme = useMemo(() => {
    if (theme === 'dark') {
      return darkTheme
    }

    return lightTheme
  }, [theme])

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <RainbowKitProvider
        modalSize="compact"
        theme={rainbowKitTheme}
        appInfo={{ disclaimer: Disclaimer }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
