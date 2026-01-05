'use client'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { IconButton } from '@sushiswap/ui'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Disclaimer } from 'src/lib/wallet/components/disclaimer'
import { useSidebar } from '../sidebar-provider'

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
  const { close } = useSidebar()
  return (
    <div className="pb-4">
      <div className="p-4 flex justify-between gap-4">
        <div className="space-y-2">
          <span className="font-medium text-lg">Connect</span>
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
        <ConnectWalletOptions onConnect={close} />
      </Suspense>
    </div>
  )
}
