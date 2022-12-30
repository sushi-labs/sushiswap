import { PaperAirplaneIcon } from '@heroicons/react/outline'
import { useIsMounted } from '@sushiswap/hooks'
import { App, AppType, Link, Menu } from '@sushiswap/ui'
import { NetworkSelector, Profile } from '@sushiswap/wagmi'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useAccount, useConnect } from 'wagmi'

import { SUPPORTED_CHAINS } from '../config'
import { useNotifications } from '../lib/state/storage'

export const Header: FC = () => {
  const isMounted = useIsMounted()
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [notifications, { clearNotifications }] = useNotifications(address)

  const connect = useConnect({
    onSuccess: () => {
      if (router.pathname === '/') {
        void router.push('/dashboard')
      }
    },
  })

  return (
    <App.Header
      appType={AppType.Furo}
      className={router.pathname === '/' ? '' : 'bg-slate-900 border-b border-slate-200/5'}
      withScrollBackground={router.pathname === '/'}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <NetworkSelector supportedNetworks={SUPPORTED_CHAINS} />
        <Profile
          supportedNetworks={SUPPORTED_CHAINS}
          notifications={notifications}
          clearNotifications={clearNotifications}
        />
        {address && isMounted && isConnected && (
          <Menu
            button={
              <Menu.Button
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
        )}
      </div>
    </App.Header>
  )
}
