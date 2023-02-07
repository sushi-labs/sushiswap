'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui13/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi13/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi13/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { Search } from './search/SearchProvider'
import { AppearOnMount } from '@sushiswap/ui13/components/animation'
import { useAutoConnect } from '@sushiswap/wagmi13'
import { useRouter } from 'next/router'
import { queryParamsSchema } from './trade/TradeProvider'

export const Header: FC = () => {
  const { isAutoConnecting } = useAutoConnect()
  const { query } = useRouter()
  const { fromChainId } = queryParamsSchema.parse(query)

  return (
    <Search>
      <GlobalNav
        rightElement={
          isAutoConnecting ? (
            <></>
          ) : (
            <AppearOnMount className="flex gap-2">
              <Search.Button />
              <HeaderNetworkSelector networks={SUPPORTED_CHAIN_IDS} selectedNetwork={fromChainId} />
              <UserProfile networks={SUPPORTED_CHAIN_IDS} />
            </AppearOnMount>
          )
        }
      >
        <NavLink title="Tokens" href="https://sushi.com/analytics" />
        <NavLink title="Pools" href="https://sushi.com/earn" />
      </GlobalNav>
      <Search.Panel />
    </Search>
  )
}
