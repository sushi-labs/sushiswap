import type { Metadata } from 'next'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'SushiSwap on Stellar',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </Providers>
  )
}
