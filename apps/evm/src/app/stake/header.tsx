'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'

import { Portfolio } from 'src/ui/portfolio/Portfolio'
export const Header: FC = () => {
  return (
    <Navigation
      rightElement={<><WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />
      <Portfolio/>
      </>
    }
    />
  )
}
