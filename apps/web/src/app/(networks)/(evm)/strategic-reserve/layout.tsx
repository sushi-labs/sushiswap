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
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden animate-slide min-h-[calc(100vh-56px)]">
        <Container maxWidth="7xl" className="px-4 pt-7 md:pt-10 mb-6">
          <Hero />
        </Container>
        <section className="flex flex-col flex-1 ">{children}</section>
      </div>
    </Suspense>
  )
}
