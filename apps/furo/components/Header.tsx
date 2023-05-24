'use client'

import { GlobalNav, NavLink } from '@sushiswap/ui/future/components/GlobalNav'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import React, { FC } from 'react'

import { SUPPORTED_CHAINS } from '../config'
import { AppearOnMount } from '@sushiswap/ui/future/components/animation'
import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { Link, Menu } from '@sushiswap/ui'
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
            <Menu
              button={
                <Menu.Button
                  className="!h-[38px]"
                  color="blue"
                  fullWidth
                  startIcon={<PaperAirplaneIcon width={18} className="transform rotate-45 -mt-0.5 -mr-0.5" />}
                  size="sm"
                  as="div"
                >
                  <span className="hidden md:block">Pay Someone</span>
                </Menu.Button>
              }
            >
              <Menu.Items unmount={false} className="!min-w-0">
                <Link.Internal passHref={true} href="/stream/create">
                  <Menu.Item as="a">Stream</Menu.Item>
                </Link.Internal>
                <Link.Internal passHref={true} href="/vesting/create">
                  <Menu.Item as="a">Vesting</Menu.Item>
                </Link.Internal>
              </Menu.Items>
            </Menu>
          </AppearOnMount>
        )
      }
    >
      <NavLink title="Swap" href="https://www.sushi.com/swap" />
      <NavLink title="Pools" href="https://www.sushi.com/pools" />
      <NavLink title="Pay" href="https://www.sushi.com/furo" />
      <Onramper.Button>
        <Button as="span" color="default" variant="empty" size="md">
          Buy Crypto
        </Button>
      </Onramper.Button>
    </GlobalNav>
  )
}
