import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ChainId as ChainIdType } from 'sushi'
import { SimpleSwapBanner } from '../(trade)/swap/_ui/simple-swap-banner'
import {
  type TradeMode,
  isSupportedTradeModeOnChainId,
} from '../(trade)/swap/_ui/trade/config'
import { Header } from '../header'
import { KatanaBackground } from './katana-background'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Trade',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{
    chainId: string
    chainId0: string
    trade: string
    tradeView?: string
  }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as ChainIdType
  const trade = params.trade as TradeMode

  if (!isSupportedTradeModeOnChainId(trade, chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} />
      <KatanaBackground chainId={chainId} />
      {children}
      <SimpleSwapBanner className="hidden xl:flex" />
    </Providers>
  )
}
