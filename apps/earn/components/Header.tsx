import { App, AppType, BuyCrypto } from '@sushiswap/ui'
import { NetworkSelector } from '@sushiswap/wagmi'
import { Profile } from '@sushiswap/wagmi/components/Wallet/Profile'
import React from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      appType={AppType.Invest}
      nav={
        <App.NavItemList>
          <App.NavItem href="https://www.sushi.com/swap" label="Swap" />
          <App.NavItem href="https://www.sushi.com/earn" label="Earn" />
          <BuyCrypto address={address} />
        </App.NavItemList>
      }
    >
      <div className="flex gap-2">
        <NetworkSelector supportedNetworks={SUPPORTED_CHAIN_IDS} />
        <Profile
          supportedNetworks={SUPPORTED_CHAIN_IDS}
          notifications={notifications}
          clearNotifications={clearNotifications}
        />
      </div>
    </App.Header>
  )
}
