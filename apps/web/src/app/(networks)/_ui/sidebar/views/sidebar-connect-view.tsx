'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { IconButton } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { DEFAULT_CHAIN_ID_BY_NAMESPACE } from 'src/lib/wallet'
import { Disclaimer } from 'src/lib/wallet/components/disclaimer'
import { getChainById } from 'sushi'
import { useSidebar } from '../sidebar-provider'
import { SidebarView } from '../types'

const ConnectWalletOptions = dynamic(
  () =>
    import(
      'src/lib/wallet/components/connect-wallet-options/connect-wallet-options'
    ),
  {
    ssr: false,
  },
)

export const SidebarConnectView = () => {
  const { close, context, view, setView } = useSidebar()

  const { namespace, action = 'connect' } = context ?? {}

  return (
    <div className="pb-4">
      <div className="p-4 flex justify-between gap-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <IconButton
              icon={ArrowLeftIcon}
              name={'Back'}
              onClick={() => setView(SidebarView.Portfolio)}
              className={!namespace && action === 'connect' ? 'hidden' : ''}
              variant="ghost"
              size="xs"
            />
            <span className="font-medium text-lg">
              {namespace
                ? `Connect ${
                    namespace === 'svm' // TODO: remove when solana is added to sushi pkg chains
                      ? 'Solana'
                      : getChainById(DEFAULT_CHAIN_ID_BY_NAMESPACE[namespace])
                          .name
                  } Wallet`
                : action === 'switch'
                  ? 'Switch Wallet'
                  : action === 'select-namespace'
                    ? 'Select Network'
                    : 'Connect'}
            </span>
          </div>
          <Disclaimer />
        </div>
        <IconButton
          icon={XMarkIcon}
          name="Close"
          className="sm:hidden"
          onClick={close}
        />
      </div>
      <Suspense>
        <ConnectWalletOptions
          action={action}
          namespace={namespace}
          onConnect={view === SidebarView.Connect ? close : undefined}
          onSelectMultiNamespaceWallet={() =>
            setView(SidebarView.Connect, { action: 'select-namespace' })
          }
        />
      </Suspense>
    </div>
  )
}
