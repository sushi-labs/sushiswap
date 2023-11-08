'use client'

import React, { FC } from 'react'
import WalletSelector from 'components/WalletSelector'
import { Navigation } from '@sushiswap/ui'

export const Header: FC = () => {
  return <Navigation showOnramper={false} rightElement={<WalletSelector />} />
}
