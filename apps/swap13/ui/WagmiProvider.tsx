'use client'

import { client } from '@sushiswap/wagmi13'
import { FC, ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

export const WagmiProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <WagmiConfig client={client}>{children}</WagmiConfig>
)
