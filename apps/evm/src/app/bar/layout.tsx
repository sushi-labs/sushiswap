import { HotJar } from '@sushiswap/ui/components/scripts'
import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiBar',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <div className="flex flex-col flex-1">{children}</div>
      </Providers>
      <HotJar />
    </>
  )
}
