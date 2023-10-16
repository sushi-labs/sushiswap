import { config, WagmiConfig as _WagmiConfig } from '@sushiswap/wagmi'

import { FC, ReactNode } from 'react'

// const config =
//   process.env.NODE_ENV !== 'test' ? createProductionWagmiConfig() : createTestWagmiConfig()

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  // console.log('WagmiConfig', config)
  return <_WagmiConfig config={config}>{children}</_WagmiConfig>
}
