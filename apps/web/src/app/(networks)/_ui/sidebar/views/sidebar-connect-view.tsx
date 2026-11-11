'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import {
  IconButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { WalletWithState } from 'src/lib/wallet'
import { Disclaimer } from 'src/lib/wallet/components/disclaimer'
import { WalletConnectorsListSkeleton } from 'src/lib/wallet/components/wallet-connectors-list/wallet-connectors-list-skeleton'
import {
  DEFAULT_CHAIN_ID_BY_NAMESPACE,
  getNameFromNamespace,
} from 'src/lib/wallet/config'
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
  | { type: 'other-wallets' }
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
  const backButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (subview.type === 'other-wallets') backButtonRef.current?.focus()
  }, [subview.type])

  const onConnect = closeOnConnect ? close : () => setView(DefaultSidebarView)

  const onBack =
    subview.type !== 'main'
      ? () => setSubview(DefaultSubview)
      : namespace || action === 'switch'
        ? () => setView(DefaultSidebarView)
        : undefined

  return (
    <div className="flex flex-col gap-3 bg-background px-6 pt-4 pb-6 cursor-default">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex min-h-8 items-center gap-2">
            <IconButton
              ref={backButtonRef}
              icon={ArrowLeftIcon}
              name={'Back'}
              onClick={onBack}
              className={classNames(
                '!h-8 !w-8 !min-h-8 !min-w-8 focus-visible:ring-pink',
                !onBack ? 'hidden' : '',
              )}
              variant="ghost"
              size="sm"
            />
            <span className="text-lg leading-7 font-medium">
              {subview.type === 'select-namespace'
                ? 'Select Network'
                : subview.type === 'other-wallets'
                  ? 'Other Wallets'
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
            <p className="text-sm leading-5 text-muted-foreground">
              {subview.wallets[0].name} supports multiple networks:
            </p>
          ) : null}
        </div>
        <IconButton
          icon={XMarkIcon}
          name="Close"
          className="!h-8 !w-8 !min-h-8 !min-w-8 shrink-0 focus-visible:ring-pink sm:hidden"
          variant="ghost"
          size="sm"
          onClick={close}
        />
      </div>
      {subview.type === 'select-namespace' ? (
        <div>
          <Suspense fallback={<WalletConnectorsListSkeleton />}>
            <WalletConnectorsList
              variant="namespace"
              onConnect={onConnect}
              wallets={subview.wallets}
            />
          </Suspense>
        </div>
      ) : namespace ? (
        <div>
          <Suspense fallback={<WalletConnectorsListSkeleton />}>
            <WalletConnectorsList
              namespace={namespace}
              showOtherWallets={subview.type === 'other-wallets'}
              onShowOtherWallets={() => setSubview({ type: 'other-wallets' })}
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
            onValueChange={(val) => {
              setTab(val as (typeof TABS)[number])
              setSubview(DefaultSubview)
            }}
            className="flex w-full flex-col"
          >
            <div className="flex shrink-0">
              <TabsList className="!h-auto w-full gap-5 !justify-start !rounded-none !border-0 !bg-transparent !p-0">
                {TABS.map((_tab) => (
                  <TabsTrigger
                    key={_tab}
                    value={_tab}
                    className="!rounded-none !border-0 !border-b-2 !border-b-transparent !px-0 !pt-0 !pb-3 text-base !shadow-none focus-visible:ring-pink data-[state=active]:!border-b-pink data-[state=active]:!bg-transparent data-[state=active]:!text-primary"
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
                className="!mt-4"
              >
                <WalletConnectorsList
                  namespace={_tab}
                  showOtherWallets={subview.type === 'other-wallets'}
                  onShowOtherWallets={() =>
                    setSubview({ type: 'other-wallets' })
                  }
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
      {subview.type !== 'select-namespace' ? <Disclaimer /> : null}
    </div>
  )
}
