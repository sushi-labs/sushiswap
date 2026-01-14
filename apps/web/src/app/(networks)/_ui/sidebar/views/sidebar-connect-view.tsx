'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { IconButton } from '@sushiswap/ui'
import { useState } from 'react'
import {
  DEFAULT_CHAIN_ID_BY_NAMESPACE,
  type WalletWithState,
} from 'src/lib/wallet'
import { Disclaimer } from 'src/lib/wallet/components/disclaimer'
import WalletConnectorsList from 'src/lib/wallet/components/wallet-connectors-list/wallet-connectors-list'
import { getChainById } from 'sushi'
import { useSidebar } from '../sidebar-provider'
import { DefaultSidebarView } from '../types'

type ConnectSubview =
  | { type: 'main' }
  | {
      type: 'select-namespace'
      wallets: WalletWithState[]
    }

const DefaultSubview = { type: 'main' } as const

export const SidebarConnectView = () => {
  const { close, context, setView } = useSidebar()
  const {
    namespace,
    action = 'connect',
    closeOnConnect = false,
  } = context ?? {}

  const [subview, setSubview] = useState<ConnectSubview>(DefaultSubview)

  const onConnect = closeOnConnect ? close : () => setView(DefaultSidebarView)

  const onBack =
    subview.type === 'select-namespace'
      ? () => setSubview(DefaultSubview)
      : namespace || action === 'switch'
        ? () => setView(DefaultSidebarView)
        : undefined

  return (
    <div className="pb-4 cursor-default">
      <div className="p-4 flex justify-between gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <IconButton
              icon={ArrowLeftIcon}
              name={'Back'}
              onClick={onBack}
              className={!onBack ? 'hidden' : ''}
              variant="ghost"
              size="xs"
            />
            <span className="font-medium text-lg">
              {subview.type === 'select-namespace'
                ? 'Select Network'
                : action === 'switch'
                  ? 'Switch Wallet'
                  : namespace
                    ? `Connect ${
                        getChainById(DEFAULT_CHAIN_ID_BY_NAMESPACE[namespace])
                          .name
                      } Wallet`
                    : 'Connect'}
            </span>
          </div>
          {subview.type === 'select-namespace' ? (
            <span className="text-sm text-muted-foreground">
              {subview.wallets[0].name} supports multiple networks:
            </span>
          ) : (
            <Disclaimer />
          )}
        </div>
        <IconButton
          icon={XMarkIcon}
          name="Close"
          className="sm:hidden"
          onClick={close}
        />
      </div>
      {subview.type === 'select-namespace' ? (
        <WalletConnectorsList
          variant="namespace"
          onConnect={onConnect}
          wallets={subview.wallets}
        />
      ) : (
        <WalletConnectorsList
          namespace={namespace}
          onConnect={onConnect}
          onSelectMultiNamespaceWallet={(wallets) =>
            setSubview({
              type: 'select-namespace',
              wallets,
            })
          }
        />
      )}
    </div>
  )
}
