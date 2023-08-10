'use client'

import { Navigation } from '@sushiswap/ui'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/future'
import React, { FC } from 'react'

import { SUPPORTED_CHAINS } from '../config'

export const Header: FC = () => {
  return <Navigation legacyBehavior={true} rightElement={<WagmiHeaderComponents chainIds={SUPPORTED_CHAINS} />} />
}
