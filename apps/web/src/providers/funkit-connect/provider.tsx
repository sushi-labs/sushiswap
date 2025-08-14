'use client'

import { FunkitProvider } from '@funkit/connect'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { sushiTheme } from './theme'

export const FunkitConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_FUNKIT_API_KEY
  const { theme } = useTheme()

  const funkitTheme = useMemo(() => {
    if (!theme || theme === 'dark') {
      return sushiTheme.darkMode
    }

    return sushiTheme.lightMode
  }, [theme])

  if (!apiKey) {
    console.warn(
      'FunKit API key is missing! Please set NEXT_PUBLIC_FUNKIT_API_KEY in your environment variables.',
    )
  }

  return (
    <FunkitProvider
      theme={funkitTheme}
      funkitConfig={{
        apiKey: apiKey || '',
        appName: 'Sushi',
        loginConfig: {
          web2: true,
          web3: true,
        },
      }}
      debug={true}
    >
      {children}
    </FunkitProvider>
  )
}
