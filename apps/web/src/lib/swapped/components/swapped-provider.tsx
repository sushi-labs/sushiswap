'use client'

import { SwappedProvider as SwappedProviderInternal } from '@sushiswap/ui'
import type { FC, ReactNode } from 'react'

import { type WalletNamespace, useAccount } from 'src/lib/wallet'
import { signSwappedData } from '../actions/sign-swapped-data'

export const SwappedProvider: FC<{
  children: ReactNode
  namespace?: WalletNamespace
  defaultAsset?: string //https://docs.swapped.com/swapped-ramp/readme/supported-cryptocurrencies
}> = ({ children, namespace, defaultAsset = 'USDC_HYPE' }) => {
  const address = useAccount(namespace || 'evm')
  return (
    <SwappedProviderInternal
      signSwappedData={signSwappedData}
      address={address}
      defaultAsset={defaultAsset}
    >
      {children}
    </SwappedProviderInternal>
  )
}
