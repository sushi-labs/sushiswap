'use client'

import type { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieToInitialState } from '@wagmi/core'
import { createProductionWagmiAdapter } from './production'
import { createTestWagmiAdapter } from './test'

export { createProductionWagmiAdapter }
export { createTestWagmiAdapter }

const createWagmiAdapter = () => {
  const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

  const config = (() => {
    if (isTest) {
      return createTestWagmiAdapter()
    }
    return createProductionWagmiAdapter()
  })()

  return config
}

let wagmiAdapterSingleton: WagmiAdapter | undefined = undefined
export const getWagmiAdapter = () => {
  if (typeof window === 'undefined') {
    return createWagmiAdapter()
  }

  if (!wagmiAdapterSingleton) {
    wagmiAdapterSingleton = createWagmiAdapter()
  }

  return wagmiAdapterSingleton
}

export const getWagmiInitialState = (
  cookieHeaders: string | null | undefined,
) => {
  const initialState = cookieToInitialState(
    getWagmiAdapter().wagmiConfig,
    cookieHeaders,
  )
  return initialState
}
