import { App, AppType } from '@sushiswap/ui'
import { NotificationCentre, Wallet } from '@sushiswap/wagmi'
import React, { FC, useEffect } from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications, createNotification }] = useNotifications(address)

  useEffect(() => {
    // if (!address) {
    //   return
    // }
    //
    // const date = new Date().getTime()
    // createNotification({
    //   type: 'swap',
    //   chainId: ChainId.ETHEREUM,
    //   summary: {
    //     pending: 'Executing transaction',
    //     completed: 'Executed transaction',
    //     failed: 'Failed to execute transaction',
    //   },
    //   txHash: '0x40deea942967e7114d76db5f7bc114a31ad90e6e21c63938a448cb43b560211c',
    //   groupTimestamp: date,
    //   timestamp: new Date().getTime(),
    //   promise: Promise.resolve(),
    // })
    //
    // setTimeout(
    //   () =>
    //     createNotification({
    //       type: 'swap',
    //       chainId: ChainId.ETHEREUM,
    //       summary: {
    //         pending: 'Executing transaction',
    //         completed: 'Executed transaction',
    //         failed: 'Failed to execute transaction',
    //       },
    //       txHash: '0x40deea942967e7114d76db5f7bc114a31ad90e6e21c63938a448cb43b560211c',
    //       groupTimestamp: date,
    //       timestamp: new Date().getTime(),
    //       promise: Promise.resolve(),
    //     }),
    //   500
    // )
  }, [address, createNotification])

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
        <NotificationCentre notifications={notifications} clearNotifications={clearNotifications} />
      </div>
    </App.Header>
  )
}
