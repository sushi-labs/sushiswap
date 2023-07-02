'use client'

import { AppearOnMount } from '@sushiswap/ui/components/animation'
import { GlobalNav } from '@sushiswap/ui/components/GlobalNav'
import { useConnect } from '@sushiswap/wagmi'
import { HeaderNetworkSelector } from '@sushiswap/wagmi/future/components/HeaderNetworkSelector'
import { UserProfile } from '@sushiswap/wagmi/future/components/UserProfile'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC } from 'react'

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
    />
  )
}
