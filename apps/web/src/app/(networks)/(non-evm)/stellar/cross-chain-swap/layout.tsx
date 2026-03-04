import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isXSwapSupportedChainId } from 'src/config'
import { NEAR_INTENTS_CHAIN_IDS } from 'src/lib/near-intents/config'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cross-Chain Swap',
  description:
    'Swap assets across multiple blockchains with ease using Cross-Chain Swap. Enjoy secure, seamless cross-chain swaps for a streamlined DeFi experience on Sushi.com.',
}

export default async function CrossChainSwapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      <Header networks={NEAR_INTENTS_CHAIN_IDS} />
      <main className="lg:p-4 mt-16 mb-[86px] h-[clamp(600px,_calc(100vh_-_280px),_800px)]">
        {children}
      </main>
    </Providers>
  )
}
