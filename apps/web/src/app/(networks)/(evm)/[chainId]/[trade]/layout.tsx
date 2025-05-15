import { Providers } from './providers'
import { Header } from '~evm/[chainId]/header';
import type { ChainId } from 'sushi/chain';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isSupportedTradeModeOnChainId, TradeMode } from 'src/ui/swap/trade/config';
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner';

export const metadata: Metadata = {
  title: 'Trade',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; trade: string; }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as ChainId;
  const trade = params.trade as TradeMode;

  if (!isSupportedTradeModeOnChainId(trade, chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} />
      <main className="lg:p-4 mt-16 mb-[86px] animate-slide">
        {children}
      </main>
      <SimpleSwapBanner className="hidden xl:flex" />
    </Providers>
  )
}
