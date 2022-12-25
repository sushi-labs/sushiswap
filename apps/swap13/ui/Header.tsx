'use client'

import { GlobalNav } from '@sushiswap/ui13/components/GlobalNav'
import { AppType } from '@sushiswap/ui13/types'
import { NetworkSelector } from '@sushiswap/wagmi13/components/NetworkSelector'
import { UserProfile } from '@sushiswap/wagmi13/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { Search } from './search/SearchProvider'

export const Header: FC = () => {
  return (
    <Search>
      <GlobalNav
        appType={AppType.Swap}
        rightElement={
          <>
            <Search.Button />
            <NetworkSelector supportedNetworks={SUPPORTED_CHAIN_IDS} />
            <UserProfile clearNotifications={() => {}} notifications={{}} supportedNetworks={SUPPORTED_CHAIN_IDS} />
          </>
        }
      />
      <Search.Panel />
    </Search>
  )
}
