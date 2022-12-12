'use client'

import { FC, ReactNode } from 'react'
import { WagmiConfig as _WagmiConfig } from 'wagmi'

import { client } from './client'

export const WagmiConfig: FC<{ children: ReactNode }> = ({ children }) => (
  <_WagmiConfig client={client}>{children}</_WagmiConfig>
)
