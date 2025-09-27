import { Header } from 'src/app/(networks)/_ui/header/header'
import { TvmChainId } from 'sushi/tvm'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Tron',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header chainId={TvmChainId.TRON} />
      <main className="lg:p-4 mt-16 mb-[86px] animate-slide">{children}</main>
    </Providers>
  )
}
