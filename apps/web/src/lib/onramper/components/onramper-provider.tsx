'use client'

import { OnramperProvider as OnramperProviderInternal } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { signOnramperData } from '../actions/sign-onramper-data'

export const OnramperProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { address } = useAccount()
  return (
    <OnramperProviderInternal
      signOnramperData={signOnramperData}
      address={address}
    >
      {children}
    </OnramperProviderInternal>
  )
}
