'use client'

import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Button } from '@sushiswap/ui/components/button'
import { GlobalNav } from '@sushiswap/ui/components/GlobalNav'
import { useConnect } from '@sushiswap/wagmi'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import { SUPPORTED_CHAIN_IDS } from 'config'
import Link from 'next/link'
import React, { FC } from 'react'
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
        <Link href="/swap">
          <Button color="default" variant="ghost" size="default">
            Swap
          </Button>
        </Link>
        <Link href="/pools">
          <Button color="default" variant="ghost" size="default">
            Pools
          </Button>
        </Link>
        <Link href="/furo">
          <Button color="default" variant="ghost" size="default">
            Pay
          </Button>
        </Link>
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
