import type { Metadata } from 'next'
import { Header } from '../header'

export const metadata: Metadata = {
  title: 'SushiSwap on Solana',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="lg:p-4 mt-16 mb-[86px] animate-slide">{children}</main>
    </>
  )
}
