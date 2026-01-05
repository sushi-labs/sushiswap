'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Disclaimer } from '../disclaimer'

const ConnectWalletOptions = dynamic(() => import('./connect-wallet-options'), {
  ssr: false,
})

export const SidebarConnectView = () => {
  return (
    <div className="pb-4">
      <div className="p-4 space-y-2">
        <span className="font-medium text-lg">Connect</span>
        <Disclaimer />
      </div>
      <Suspense>
        <ConnectWalletOptions />
      </Suspense>
    </div>
  )
}
