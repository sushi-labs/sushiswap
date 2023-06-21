'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAINS } from '../config'
import { AppearOnMount } from '@sushiswap/ui/future/components/animation'
import { useConnect } from '@sushiswap/wagmi'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { Button } from '@sushiswap/ui/future/components/button'

export const Header: FC = () => {
  const { isLoading } = useConnect()
  return (
    <GlobalNav
      rightElement={
        isLoading ? (
          <></>
        ) : (
          <AppearOnMount className="flex gap-2">
            <HeaderNetworkSelector networks={SUPPORTED_CHAINS} />
            <UserProfile networks={SUPPORTED_CHAINS} />
            <a href="/furo/create">
              <Button asChild fullWidth>
                <span className="hidden md:block">Pay Someone</span>
              </Button>
            </a>
          </AppearOnMount>
        )
      }
    >
      <NavLink title="Swap" href="https://www.sushi.com/swap" />
      <NavLink title="Pools" href="https://www.sushi.com/pools" />
      <NavLink title="Pay" href="https://www.sushi.com/furo" />
      <Onramper.Button>
        <Button variant="ghost">Buy Crypto</Button>
      </Onramper.Button>
    </GlobalNav>
  )
}
