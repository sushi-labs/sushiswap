import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'

import { GlobalNav, NavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import { AppearOnMount } from '@sushiswap/ui/future/components/animation'
import { useConnect } from '@sushiswap/wagmi'

export const Header: FC = () => {
  const { isLoading } = useConnect()

  return (
    <GlobalNav
      rightElement={
        isLoading ? (
          <></>
        ) : (
          <AppearOnMount className="flex gap-2">
            <HeaderNetworkSelector networks={SUPPORTED_CHAIN_IDS} />
            <UserProfile networks={SUPPORTED_CHAIN_IDS} />
          </AppearOnMount>
        )
      }
    >
      <NavLink title="Swap" href="https://sushi.com/swap" />
      <NavLink title="Pools" href="https://sushi.com/earn" />
    </GlobalNav>
  )
}
