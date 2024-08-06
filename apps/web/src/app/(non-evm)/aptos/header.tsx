'use client'

import {
  Navigation,
  NavigationElement,
  NavigationElementType,
} from '@sushiswap/ui'
import React, { FC } from 'react'

import { UserProfile } from './(common)/ui/user-profile/user-profile'

const nagivationElements: NavigationElement[] = [
  {
    title: 'Swap',
    href: '/aptos/swap',
    show: 'everywhere',
    type: NavigationElementType.Single,
  },
  {
    title: 'Pool',
    href: '/aptos/pool',
    show: 'everywhere',
    type: NavigationElementType.Single,
  },
]

export const Header: FC = () => {
  return (
    <Navigation
      leftElements={nagivationElements}
      rightElement={<UserProfile />}
    />
  )
}
