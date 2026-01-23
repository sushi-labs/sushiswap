import { Container } from '@sushiswap/ui'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import { Header } from '~evm/[chainId]/header'
import { Hero } from './_ui/hero'

export default function ReferralsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header networks={SUPPORTED_CHAIN_IDS} />
      <main className="flex flex-col h-full flex-1 animate-slide">
        <Container maxWidth="7xl" className="px-4 pb-6 pt-14 md:pb-20 md:pt-28">
          <Hero />
        </Container>
        <section className="flex flex-col flex-1">
          <div className="min-h-screen">{children}</div>
        </section>
      </main>
    </>
  )
}
