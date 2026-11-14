'use client'

import { Suspense } from 'react'
import {
  COW_LIMIT_CHAIN_IDS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { WNATIVE } from 'sushi/evm'
import { Header } from '../../header'
import { DerivedstateSimpleSwapProvider } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { CowLimitSkeleton } from './cow-limit-skeleton'

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
      {/* Part of the prerendered shell, since the provider reads search params. */}
      <Suspense
        fallback={
          <main className="lg:p-4 mt-16 mb-[86px]">
            <CowLimitSkeleton />
          </main>
        }
      >
        <DerivedstateSimpleSwapProvider
          chainId={chainId}
          key={chainId}
          initialToken0={WNATIVE[chainId]}
        >
          <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
        </DerivedstateSimpleSwapProvider>
      </Suspense>
    </>
  )
}
