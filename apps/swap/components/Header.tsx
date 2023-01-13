import { App, AppType, BuyCrypto, classNames } from '@sushiswap/ui'
import { NetworkSelector } from '@sushiswap/wagmi'
import { Profile } from '@sushiswap/wagmi/components/Wallet/Profile'
import React, { FC } from 'react'
import { useAccount } from 'wagmi'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { useNotifications } from '../lib/state/storage'
import { Onramper } from '@sushiswap/wagmi/components/Onramper/Onramper'

export const Header: FC = () => {
  const { address } = useAccount()
  const [notifications, { clearNotifications }] = useNotifications(address)
  return (
    <App.Header
      withScrollBackground={true}
      appType={AppType.Swap}
      nav={
        <App.NavItemList>
          <App.NavItem href="https://www.sushi.com/swap" label="Swap" />
          <App.NavItem href={`https://www.sushi.com/earn`} label="Earn" />
          {/* <App.NavItem href="https://www.sushi.com/bridge" label="Bridge" /> */}
          <Onramper>
            {({ setOpen }) => (
              <span
                onClick={() => setOpen(true)}
                className={classNames(
                  'flex items-center text-slate-400 text-sm font-semibold hover:text-white cursor-pointer'
                )}
              >
                Buy Crypto
              </span>
            )}
          </Onramper>
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
