'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  IconButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import {
  DEFAULT_CHAIN_ID_BY_NAMESPACE,
  type WalletWithState,
  getNameFromNamespace,
} from 'src/lib/wallet'
import { Disclaimer } from 'src/lib/wallet/components/disclaimer'
import { WalletConnectorsListSkeleton } from 'src/lib/wallet/components/wallet-connectors-list/wallet-connectors-list-skeleton'
import { getChainById } from 'sushi'
import { useSidebar } from '../sidebar-provider'
import { DefaultSidebarView } from '../types'

const WalletConnectorsList = dynamic(
  () =>
    import(
      'src/lib/wallet/components/wallet-connectors-list/wallet-connectors-list'
    ),
  {
    ssr: false,
    loading: () => <WalletConnectorsListSkeleton />,
  },
)

type ConnectSubview =
  | { type: 'main' }
  | {
      type: 'select-namespace'
      wallets: WalletWithState[]
    }

const DefaultSubview = { type: 'main' } as const

const TABS = ['evm', 'svm', 'stellar'] as const

export const SidebarConnectView = () => {
  const { close, context, setView } = useSidebar()
  const {
    namespace,
    action = 'connect',
    closeOnConnect = false,
  } = context ?? {}

  const [subview, setSubview] = useState<ConnectSubview>(DefaultSubview)
  const [tab, setTab] = useState<(typeof TABS)[number]>('evm')

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
        <div className="overflow-y-auto h-[calc(100vh-127px)] sm:h-[calc(100vh-203px)]">
          <Suspense fallback={<WalletConnectorsListSkeleton />}>
            <WalletConnectorsList
              variant="namespace"
              onConnect={onConnect}
              wallets={subview.wallets}
            />
          </Suspense>
        </div>
      ) : namespace ? (
        <div className="overflow-y-auto h-[calc(100vh-127px)] sm:h-[calc(100vh-203px)]">
          <Suspense fallback={<WalletConnectorsListSkeleton />}>
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
          </Suspense>
        </div>
      ) : (
        <Suspense fallback={<WalletConnectorsListSkeleton />}>
          <Tabs
            value={tab}
            onValueChange={(val) => setTab(val as (typeof TABS)[number])}
            className="w-full"
          >
            <div className="flex px-2">
              <TabsList className="w-full h-8">
                {TABS.map((_tab) => (
                  <TabsTrigger
                    key={_tab}
                    value={_tab}
                    className="w-full h-7 text-xs"
                  >
                    {getNameFromNamespace(_tab)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {TABS.map((_tab) => (
              <TabsContent
                value={_tab}
                key={`tab-content-${_tab}`}
                className="overflow-y-auto h-[calc(100vh-165px)] sm:h-[calc(100vh-241px)]"
              >
                <WalletConnectorsList
                  namespace={_tab}
                  onConnect={onConnect}
                  onSelectMultiNamespaceWallet={(wallets) =>
                    setSubview({
                      type: 'select-namespace',
                      wallets,
                    })
                  }
                />
              </TabsContent>
            ))}
          </Tabs>
        </Suspense>
      )}
    </div>
  )
}
