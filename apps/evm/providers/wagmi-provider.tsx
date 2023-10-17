import {
  WagmiConfig as _WagmiConfig,
  createProductionConfig,
  createTestConfig,
} from '@sushiswap/wagmi'

import { FC, ReactNode } from 'react'

const config =
  process.env.NEXT_PUBLIC_APP_ENV !== 'test'
    ? createProductionConfig()
    : createTestConfig()

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  // console.log('WagmiConfig', config)
  return <_WagmiConfig config={config}>{children}</_WagmiConfig>
}
