import {
  WagmiConfig as _WagmiConfig,
  createProductionConfig,
  createTestConfig,
} from '@sushiswap/wagmi'
import type { FC, ReactNode } from 'react'

const isTest = process.env.NEXT_PUBLIC_APP_ENV !== 'test'

console.log('isTest', isTest)

const config =
  !isTest
    ? createProductionConfig()
    : createTestConfig()

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  return <_WagmiConfig config={config}>{children}</_WagmiConfig>
}
