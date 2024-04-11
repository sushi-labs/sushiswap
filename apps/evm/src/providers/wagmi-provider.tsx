'use client'

import { State, WagmiProvider } from '@sushiswap/wagmi'
import { type FC, type ReactNode } from 'react'
import { wagmiConfig } from 'src/lib/wagmi'

export const WagmiConfig: FC<{
  children: ReactNode
  initialState: State | undefined
}> = ({ children, initialState }) => {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
