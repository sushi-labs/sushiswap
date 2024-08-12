'use client'

import { cookieToInitialState } from '@wagmi/core'
import { createProductionConfig } from './production'
import { PublicWagmiConfig } from './public'
import { createTestConfig } from './test'

export { createProductionConfig }
export { createTestConfig }

export const wagmiConfig = (() => {
  const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

  const config = (() => {
    if (isTest) {
      return createTestConfig() as unknown as PublicWagmiConfig
    }
    return createProductionConfig()
  })()

  return config
})()

export const getWagmiInitialState = (
  cookieHeaders: string | null | undefined,
) => {
  const initialState = cookieToInitialState(wagmiConfig, cookieHeaders)
  return initialState
}
