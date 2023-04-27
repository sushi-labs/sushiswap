'use client'

import { client, WagmiConfig } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

export const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
