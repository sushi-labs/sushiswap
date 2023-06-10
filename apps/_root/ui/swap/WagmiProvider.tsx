import { client } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'
import { WagmiConfig as _WagmiConfig } from '@sushiswap/wagmi'

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => (
  <_WagmiConfig client={client}>{children}</_WagmiConfig>
)
