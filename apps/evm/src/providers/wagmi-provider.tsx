'use client'

import { type FC, type ReactNode } from 'react'
import { wagmiConfig } from 'src/lib/wagmi/config'
import { State } from 'wagmi'
import { WagmiProvider } from 'wagmi'
// import { type ChainId } from 'sushi'

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
