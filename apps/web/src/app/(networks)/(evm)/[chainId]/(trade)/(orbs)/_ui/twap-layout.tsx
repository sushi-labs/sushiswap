'use client'

import { notFound } from 'next/navigation'
import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/twap'
import { Header } from '../../header'
import { DerivedstateSimpleSwapProvider } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { isTwapSupportedChainId } from './helper'

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
    <DerivedstateSimpleSwapProvider>
      <Header chainId={chainId} networks={TWAP_SUPPORTED_CHAIN_IDS} />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </DerivedstateSimpleSwapProvider>
  )
}
