'use client'

import { Navigation } from '@sushiswap/ui/components/navigation'
import React, { FC } from 'react'

import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
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
