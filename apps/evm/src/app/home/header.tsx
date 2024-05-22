'use client'

import { Navigation } from '@sushiswap/ui/components/navigation'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'

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
