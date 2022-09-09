import { App, AppType } from '@sushiswap/ui'
import { NotificationCentre, Wallet } from '@sushiswap/wagmi'
import React, { FC } from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications, addNotification }] = useNotifications(address)

  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItem href="/swap" label="Swap" />
          <App.NavItem href="/pool" label="Earn" />
        </App.NavItemList>
      }
    >
      <div className="flex items-center gap-2">
        <Wallet.Button
          size="sm"
          className="border-none shadow-md whitespace-nowrap"
          supportedNetworks={SUPPORTED_CHAIN_IDS}
        />
        <NotificationCentre
          notifications={notifications}
          clearNotifications={clearNotifications}
          addNotification={addNotification}
        />
      </div>
    </App.Header>
  )
}
