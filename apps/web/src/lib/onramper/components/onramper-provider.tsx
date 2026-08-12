'use client'

import { OnramperProvider as OnramperProviderInternal } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'
import { useAccount } from 'wagmi'
import { createOnramperUrl } from '../actions/create-onramper-url'

export const OnramperProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const { address } = useAccount()
  return (
    <OnramperProviderInternal
      createOnramperUrl={createOnramperUrl}
      address={address}
    >
      {children}
    </OnramperProviderInternal>
  )
}
