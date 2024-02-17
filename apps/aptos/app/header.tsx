'use client'

import { Navigation } from '@sushiswap/ui'
import React, { FC } from 'react'
import { UserProfile } from 'ui/common/user-profile/user-profile'

export const Header: FC = () => {
  return <Navigation showOnramper={false} rightElement={<UserProfile />} />
}
