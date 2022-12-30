import { App, AppType } from '@sushiswap/ui'
import { NetworkSelector } from '@sushiswap/wagmi'
import { Profile } from '@sushiswap/wagmi/components/Wallet/Profile'
import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'
import React from 'react'
import { useAccount } from 'wagmi'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)
  return (
    <App.Header
      appType={AppType.Bridge}
      withScrollBackground
      nav={
        <App.NavItemList>
          <App.NavItem href="https://www.sushi.com/swap" label="Swap" />
          <App.NavItem href="https://www.sushi.com/earn" label="Earn" />
          <App.NavItem href="https://www.sushi.com/bridge" label="Bridge" />
        </App.NavItemList>
      }
    >
      <div className="flex items-center gap-2">
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
