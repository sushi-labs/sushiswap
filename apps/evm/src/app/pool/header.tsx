'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { useChainId } from 'wagmi'

export const Header: FC = () => {
  const chainId = useChainId()
  return (
    <Navigation
      rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />}
      chainId={chainId}
    />
  )
}
