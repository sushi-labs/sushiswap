import { Container } from '@sushiswap/ui'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EvmChainId } from 'sushi/evm'
import { Header } from '~evm/[chainId]/header'
import { Hero } from './_ui'

export const metadata: Metadata = {
  title: 'Strategic Reserve',
  description: 'View SUSHI Buyback & Strategic Reserve.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Header chainId={EvmChainId.ETHEREUM} />
      <div className="flex flex-col flex-1 overflow-y-auto animate-slide min-h-[calc(100vh-56px)] bg-gray-50 dark:bg-white/[0.02]">
        <Container maxWidth="8xl" className="px-4 pt-8 md:pt-16 mb-6 md:mb-12">
          <Hero />
        </Container>
        <section className="flex flex-col flex-1 ">{children}</section>
      </div>
    </Suspense>
  )
}
