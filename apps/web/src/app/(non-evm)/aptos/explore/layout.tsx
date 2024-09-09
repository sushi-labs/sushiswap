import { Container } from '@sushiswap/ui'
import { Hero } from './hero'
import { Providers } from './providers'

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 py-[9.5rem]">
        <Hero />
      </Container>
      <section className="flex flex-col min-h-screen">
        <div className="flex-1 bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20">
          <Providers>{children}</Providers>
        </div>
      </section>
    </>
  )
}
