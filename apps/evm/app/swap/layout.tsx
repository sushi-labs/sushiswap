import { HotJar } from '@sushiswap/ui/components/scripts'
import { WagmiHeaderComponents } from '@sushiswap/wagmi/future'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap',
  description: 'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <div className="grid grid-cols-[62px_auto] xl:grid-cols-[220px_auto] h-full">
          <Header />
          <div className="flex flex-col">
            <div className="p-2 flex gap-2 justify-end">
              <WagmiHeaderComponents chainIds={SUPPORTED_CHAIN_IDS} />
            </div>
            <div className="lg:p-4 pt-16 mb-[86px]">{children}</div>
          </div>
        </div>
      </Providers>
      <HotJar />
    </>
  )
}
