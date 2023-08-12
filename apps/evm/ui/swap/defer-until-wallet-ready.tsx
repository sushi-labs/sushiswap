'use client'

import { useAccount } from '@sushiswap/wagmi'
import Loading from 'app/swap/loading'
import { FC, ReactNode } from 'react'

export const DeferUntilWalletReady: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useAccount()

  if (status === 'connecting' || status === 'reconnecting') {
    return <Loading />
  }

  return <>{children}</>
}
