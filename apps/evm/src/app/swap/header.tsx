'use client'

import { Navigation } from '@sushiswap/ui/components/navigation'
import { useChainId } from '@sushiswap/wagmi'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/components'
import React, { FC } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'

export const Header: FC = () => {
  const chainId = useChainId()
  return (
    <Navigation
      rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />}
      chainId={chainId}
    />
  )
}
