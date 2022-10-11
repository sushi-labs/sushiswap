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
    params.append('apiKey', '5baa5495-64a5-4bcb-af71-febf3e54b07e')
    if (address) {
      params.append('walletAddress', address)
    }
    params.append('networks', TRANSAK_NETWORKS.join(','))
    params.append('redirectURL', 'https://www.sushi.com/swap')
    params.append('isAutoFillUserData', 'true')
    params.append('hideMenu', 'true')
    params.append('isFeeCalculationHidden', 'true')
    // params.append('themeColor', '#3B82F6')
    return `https://global.transak.com/?${params.toString()}`
  }, [address])
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItemInternal href="https://sushi.com/swap" label="Swap" />
          <App.NavItemInternal href="https://sushi.com/earn" label="Earn" />
          <App.NavItemInternal href="https://sushi.com/bridge" label="Bridge" />
          <App.NavItemExternal href={buyUrl} label="Buy" />
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
