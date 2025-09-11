import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Aptos',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="lg:p-4 mt-28 mb-[86px] animate-slide">{children}</main>
    </Providers>
  )
}
