'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { headerElements } from '../../_common/header-elements'

export const Header: FC = () => {
  return (
    <Navigation
      leftElements={headerElements}
      rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />}
    />
  )
}
