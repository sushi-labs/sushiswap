'use client'

import { TWAP_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/twap'
import { EvmChainId } from 'sushi/evm'
import { Header } from '../../header'
import { isTwapSupportedChainId } from './helper'
import { notFound } from 'next/navigation'
import { DerivedStateSwapWidgetProvider } from '~evm/[chainId]/token/[address]/_ui/derivedstate-swap-widget-provider'
import { SupportedChainId } from 'src/config'
import { DerivedstateSimpleSwapProvider } from '../../swap/_ui/derivedstate-simple-swap-provider'

export const TwapLayout = ({
  children,
  chainId,
}: {
  children: React.ReactNode
  chainId: number
}) => {
  if (!isTwapSupportedChainId(chainId as EvmChainId)) {
    return notFound()
  }

  return (
    <DerivedstateSimpleSwapProvider>
      <Header
        chainId={chainId as EvmChainId}
        networks={TWAP_SUPPORTED_CHAIN_IDS}
      />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </DerivedstateSimpleSwapProvider>
  )
}
