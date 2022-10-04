import { App, AppType } from '@sushiswap/ui'
import { NotificationCentre, Wallet } from '@sushiswap/wagmi'
import React, { FC, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'

const TRANSAK_NETWORKS = [
  'ethereum',
  'arbitrum',
  'optimism',
  'bsc',
  'polygon',
  'avaxcchain',
  'celo',
  'fantom',
  'moonriver',
]

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)
  const buyUrl = useMemo(() => {
    const params = new URLSearchParams()
    params.append('apiKey', '71d9cc91-826d-41b6-b6ba-7d8962a9c3e0')
    if (address) {
      params.append('walletAddress', address)
    }
    params.append('networks', TRANSAK_NETWORKS.join(','))

    return `https://global-stg.transak.com/?${params.toString()}`
  }, [address])
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItem href="https://sushi.com/swap" label="Swap" />
          <App.NavItem href="https://sushi.com/xswap" label="xSwap" />
          <App.NavItem href="https://sushi.com/earn" label="Earn" />
          <App.NavItem href={buyUrl} label="Buy" external />
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
