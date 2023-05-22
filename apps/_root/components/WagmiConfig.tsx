'use client'

import { client, WagmiConfig as _WagmiConfig } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => {
  return <_WagmiConfig client={client}>{children}</_WagmiConfig>
}
