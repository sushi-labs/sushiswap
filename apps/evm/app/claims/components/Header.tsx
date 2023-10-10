'use client'

import { Navigation } from '@sushiswap/ui'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/future'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

export const Header: FC = () => {
  return (
    <Navigation
      rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />}
    />
  )
}
