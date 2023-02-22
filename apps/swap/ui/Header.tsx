'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { Search } from './search/SearchProvider'
import { AppearOnMount } from '@sushiswap/ui/future/components/animation'
import { useAutoConnect } from '@sushiswap/wagmi'
import { useRouter } from 'next/router'
import { queryParamsSchema, useSwapActions } from './trade/TradeProvider'

export const Header: FC = () => {
  const { isAutoConnecting } = useAutoConnect()
  const { setNetworks } = useSwapActions()
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
              <HeaderNetworkSelector
                networks={SUPPORTED_CHAIN_IDS}
                selectedNetwork={fromChainId}
                onChange={setNetworks}
              />
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
