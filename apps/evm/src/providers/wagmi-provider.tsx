'use client'

import {
  State,
  WagmiProvider,
  getChainId,
  switchChain,
  watchChainId,
} from '@sushiswap/wagmi'
import { type FC, type ReactNode, useEffect } from 'react'
import { wagmiConfig } from 'src/lib/wagmi'
import { type ChainId } from 'sushi'

export const WagmiConfig: FC<{
  children: ReactNode
  initialState: State | undefined
}> = ({ children, initialState }) => {
  useEffect(() => {
    switchChain(wagmiConfig, {
      chainId: (initialState?.chainId as ChainId) || 1,
    })

    console.log(getChainId(wagmiConfig))

    watchChainId(wagmiConfig, {
      onChange: (a) => {
        console.log('SOMEONE SWITCHED TO Chain ID:', a)
      },
    })

    console.log(initialState?.chainId || 1)
  }, [initialState])

  console.log(initialState, getChainId(wagmiConfig))

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      {children}
    </WagmiProvider>
  )
}
