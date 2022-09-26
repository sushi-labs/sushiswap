import { App, AppType } from '@sushiswap/ui'
import { NotificationCentre, Wallet } from '@sushiswap/wagmi'
import React from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)

  return (
    <App.Header
      appType={AppType.Pool}
      nav={
        <App.NavItemList>
          <App.NavItem href="https://sushi.com/swap" label="Swap" />
          <App.NavItem href="https://sushi.com/xswap" label="XSwap" />
          <App.NavItem href="https://sushi.com/invest" label="Invest" />
        </App.NavItemList>
      }
    >
      <div className="flex gap-2">
        <Wallet.Button
          size="sm"
          className="border-none shadow-md whitespace-nowrap"
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
        <NotificationCentre notifications={notifications} clearNotifications={clearNotifications} />
      </div>
    </App.Header>
  )
}
