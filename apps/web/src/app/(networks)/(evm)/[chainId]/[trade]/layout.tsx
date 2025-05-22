import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner'
import {
  TRADE_MODES,
  type TradeMode,
  isSupportedTradeModeOnChainId,
} from 'src/ui/swap/trade/config'
import type { EvmChainId } from 'sushi/chain'
import { Header } from './header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Trade',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; trade: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as EvmChainId
  const trade = TRADE_MODES.includes(params.trade as TradeMode)
    ? (params.trade as TradeMode)
    : 'swap'

  if (!isSupportedTradeModeOnChainId(trade, chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} />
      {children}
      <SimpleSwapBanner className="hidden xl:flex" />
    </Providers>
  )
}
