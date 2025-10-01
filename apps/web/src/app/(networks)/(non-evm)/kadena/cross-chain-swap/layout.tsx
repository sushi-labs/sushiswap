import { KvmChainId } from 'sushi/kvm'
import { Header } from '~kadena/header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Kadena',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="lg:p-4 mt-20 mb-[86px]">{children}</main>
    </Providers>
  )
}
