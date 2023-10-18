'use client'

import { Navigation } from '@sushiswap/ui/components/navigation'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <Navigation
      rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />}
    />
  )
}
