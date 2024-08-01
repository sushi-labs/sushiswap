'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'

import { UserProfile } from './(common)/ui/user-profile/user-profile'

export const Header: FC = () => {
  return (
    <Navigation
      showOnramper={false}
      leftElements={['Swap', 'Pools']}
      rightElement={<UserProfile />}
    />
  )
}
