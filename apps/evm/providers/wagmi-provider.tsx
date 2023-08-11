import { config, WagmiConfig as _WagmiConfig } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => (
  <_WagmiConfig config={config}>{children}</_WagmiConfig>
)
