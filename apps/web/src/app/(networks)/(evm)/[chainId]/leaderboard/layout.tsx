import { Container } from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { type EvmChainId, evmChainIds, isEvmChainId } from 'sushi/evm'
import { Header } from '../header'
import { Hero } from './hero'

export default async function LeaderboardLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId
  if (!isEvmChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} networks={evmChainIds} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 py-8 md:py-16">
          <Hero />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-10 min-h-screen">
            {children}
          </div>
        </section>
      </main>
    </>
  )
}
