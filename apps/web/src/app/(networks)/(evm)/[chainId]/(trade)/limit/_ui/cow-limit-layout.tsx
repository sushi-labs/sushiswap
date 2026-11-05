'use client'

import { Suspense } from 'react'
import {
  COW_LIMIT_CHAIN_IDS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { Header } from '../../header'
import { DerivedstateSimpleSwapProvider } from '../../swap/_ui/derivedstate-simple-swap-provider'

export function CowLimitLayout({
  chainId,
  children,
}: {
  chainId: CowLimitChainId
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <>
      <Header chainId={chainId} networks={COW_LIMIT_CHAIN_IDS} />
      <Suspense fallback={null}>
        <DerivedstateSimpleSwapProvider chainId={chainId} key={chainId}>
          <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
        </DerivedstateSimpleSwapProvider>
      </Suspense>
    </>
  )
}
