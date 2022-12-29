'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui13/components/GlobalNav'
import { AppType } from '@sushiswap/ui13/types'
import { HeaderNetworkSelector } from '@sushiswap/wagmi13/components/HeaderNetworkSelector'
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
            <HeaderNetworkSelector networks={SUPPORTED_CHAIN_IDS} />
            <UserProfile networks={SUPPORTED_CHAIN_IDS} />
          </>
        }
      >
        <NavLink title="Tokens" href="https://sushi.com/analytics" />
        <NavLink title="Pools" href="https://sushi.com/earn" />
      </GlobalNav>
      <Search.Panel />
    </Search>
  )
}
