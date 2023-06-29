'use client'

import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { Button } from '@sushiswap/ui/components/button'
import { GlobalNav, NavLink } from '@sushiswap/ui/components/GlobalNav'
import { useConnect } from '@sushiswap/wagmi'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAINS } from '../config'

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
              <Button
                icon={PaperAirplaneIcon}
                iconProps={{ className: 'transform rotate-45 mt-[-4px] ml-0.5' }}
                asChild
                fullWidth
              >
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
