'use client'

import { cookieToInitialState } from '@wagmi/core'
import { createProductionConfig } from './production'
import { PublicWagmiConfig } from './public'
import { createTestConfig } from './test'

export { createProductionConfig }
export { createTestConfig }

const createWagmiConfig = ({ useCookies }: { useCookies: boolean }) => {
  const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

  const config = (() => {
    if (isTest) {
      return createTestConfig() as unknown as PublicWagmiConfig
    }
    return createProductionConfig({ useCookies })
  })()

  return config
}

let wagmiConfigSingleton: PublicWagmiConfig | undefined = undefined
export const getWagmiConfig = ({ useCookies }: { useCookies: boolean }) => {
  if (typeof window === 'undefined') {
    return createWagmiConfig({ useCookies })
  }

  if (!wagmiConfigSingleton) {
    wagmiConfigSingleton = createWagmiConfig({ useCookies })
  }

  return wagmiConfigSingleton
}

export const getWagmiInitialState = (
  cookieHeaders: string | null | undefined,
  functionalCookiesEnabled: boolean,
) => {
  const initialState = cookieToInitialState(
    getWagmiConfig({ useCookies: functionalCookiesEnabled }),
    cookieHeaders,
  )
  return initialState
}
