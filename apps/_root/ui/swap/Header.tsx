import { GlobalNav, NavLink } from '@sushiswap/ui/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { Search } from './search/SearchProvider'
import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { useSwapActions } from './trade/TradeProvider'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { Button } from '@sushiswap/ui/components/button'
import { useConnect } from '@sushiswap/wagmi'
import { useTokenState } from './token/TokenProvider'

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
        <NavLink title="Pay" href="https://www.sushi.com/furo" />
        <Onramper.Button>
          <Button variant="ghost" className="whitespace-nowrap">
            Buy Crypto
          </Button>
        </Onramper.Button>
      </GlobalNav>
      <Search.Panel />
    </Search>
  )
}
