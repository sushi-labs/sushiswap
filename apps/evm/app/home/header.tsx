'use client'

import { Navigation } from '@sushiswap/ui'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/future/components/WagmiHeaderComponents'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'

export const Header: FC = () => {
  return (
    <Navigation
      rightElement={
        <div className="flex gap-2">
          <WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />
        </div>
      }
    />
  )
}
