'use client'

import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  TWAP_SUPPORTED_CHAIN_IDS,
  isTwapSupportedChainId,
} from 'src/lib/swap/twap/supported-chain-ids'
import { Header } from '../../header'
import { DerivedstateSimpleSwapProvider } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { EvmSimpleSwapTradeQuoteProvider } from '../../swap/_ui/evm-simple-swap-trade-quote-provider'

export const TwapLayout = ({
  children,
  chainId,
}: {
  children: React.ReactNode
  chainId: number
}) => {
  if (!isTwapSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} networks={TWAP_SUPPORTED_CHAIN_IDS} />
      <Suspense fallback={null}>
        <DerivedstateSimpleSwapProvider chainId={chainId}>
          <EvmSimpleSwapTradeQuoteProvider>
            <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
          </EvmSimpleSwapTradeQuoteProvider>
        </DerivedstateSimpleSwapProvider>
      </Suspense>
    </>
  )
}
