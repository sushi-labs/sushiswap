'use client'

import {
  Navigation,
  NavigationElement,
  NavigationElementType,
} from '@sushiswap/ui'
import React, { FC } from 'react'

import { WalletConnector } from '~tron/_common/ui/WalletConnector/WalletConnector'

const nagivationElements: NavigationElement[] = [
  {
    title: 'Swap',
    href: '/tron/swap',
    show: 'everywhere',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: '/tron/pool',
    show: 'everywhere',
    type: NavigationElementType.Single,
  },
]

export const Header: FC = () => {
  return (
    <Navigation
      leftElements={nagivationElements}
      rightElement={<WalletConnector />}
    />
  )
}
