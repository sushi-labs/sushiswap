'use client'

import {
  State,
  WagmiProvider,
  // getChainId,
  // switchChain,
  // watchChainId,
} from '@sushiswap/wagmi'
import { type FC, type ReactNode } from 'react'
import { wagmiConfig } from 'src/lib/wagmi'
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
