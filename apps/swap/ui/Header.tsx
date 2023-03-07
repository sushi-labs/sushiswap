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
import { useAccount } from 'wagmi'
import Nav from '@sushiswap/ui/app/Nav'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { Button } from '@sushiswap/ui/future/components/button'

export const Header: FC = () => {
  const { isAutoConnecting } = useAutoConnect()
  const { setNetworks } = useSwapActions()
  const { query } = useRouter()
  const {
    fromCurrency: { fromChainId },
  } = queryParamsSchema.parse(query)

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
        <NavLink title="Earn" href="https://sushi.com/earn" />
        <Onramper.Button>
          <Button as="span" color="default" variant="empty" size="md">
            Buy Crypto
          </Button>
        </Onramper.Button>
      </GlobalNav>
      <Search.Panel />
    </Search>
  )
}
