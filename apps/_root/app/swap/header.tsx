'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { AppearOnMount } from '@sushiswap/ui/future/components/animation'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { Button } from '@sushiswap/ui/future/components/button'
import { useConnect } from '@sushiswap/wagmi'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Search } from 'ui/swap/search/SearchProvider'
import { useTokenState } from 'ui/swap/token/TokenProvider'
import { useSwapActions } from 'ui/swap/trade/TradeProvider'

export const Header: FC = () => {
  const { isLoading } = useConnect()
  const { setNetworks } = useSwapActions()
  const { fromChainId } = useTokenState()
  return (
    <Search>
      <GlobalNav
        rightElement={
          isLoading ? (
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
        <NavLink title="Swap" href="https://www.sushi.com/swap" />
        <NavLink title="Pools" href="https://www.sushi.com/pools" />
        <Onramper.Button>
          <Button as="span" color="default" variant="empty" size="md" className="whitespace-nowrap">
            Buy Crypto
          </Button>
        </Onramper.Button>
      </GlobalNav>
      <Search.Panel />
    </Search>
  )
}
