import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { SimpleSwapBanner } from 'src/ui/swap/simple/simple-swap-banner'
import {
  type TradeMode,
  isSupportedTradeModeOnChainId,
} from 'src/ui/swap/trade/config'
import { ChainId } from 'sushi/chain'
import type { ChainId as ChainIdType } from 'sushi/chain'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Trade',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function TradeLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; chainId0: string; trade: string }>
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
      {chainId === ChainId.KATANA ? <KatanaBackground /> : null}
      {children}
      <SimpleSwapBanner className="hidden xl:flex" />
    </Providers>
  )
}

const KatanaBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/katana-bg-light.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left dark:hidden"
      />
      <Image
        src="/katana-bg-dark.jpg"
        alt=""
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover object-left hidden dark:block"
      />
      <div
        className={`
          absolute inset-0
          bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,255,255,0.80)_8.1%,_rgba(255,255,255,0)_100%)]
          dark:bg-[linear-gradient(180deg,_#0F172A_0%,_rgba(15,23,42,0.80)_8.1%,_rgba(15,23,42,0)_100%)]
        `}
      />
    </div>
  )
}
