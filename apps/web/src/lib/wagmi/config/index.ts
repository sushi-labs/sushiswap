'use client'

import { cookieToInitialState } from '@wagmi/core'
import { Porto } from 'porto'
import { createProductionConfig } from './production'
import type { PublicWagmiConfig } from './public'
import { createTestConfig } from './test'

export { createProductionConfig }
export { createTestConfig }

const createWagmiConfig = () => {
  const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

  const config = (() => {
    if (isTest) {
      return createTestConfig() as unknown as PublicWagmiConfig
    }
    return createProductionConfig()
  })()

  return config as PublicWagmiConfig
}

let wagmiConfigSingleton: PublicWagmiConfig | undefined = undefined
export const getWagmiConfig = () => {
  if (typeof window === 'undefined') {
    return createWagmiConfig()
  }

  if (!wagmiConfigSingleton) {
    wagmiConfigSingleton = createWagmiConfig()
    Porto.create()
  }

  return wagmiConfigSingleton
}

export const getWagmiInitialState = (
  cookieHeaders: string | null | undefined,
) => {
  const initialState = cookieToInitialState(getWagmiConfig(), cookieHeaders)
  return initialState
}
