import { Container } from '@sushiswap/ui'

import { Hero } from '../../pool/hero'

export default async function PoolsLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Container maxWidth="7xl" className="px-4 pt-20 pb-10">
        <Hero />
      </Container>
      <section className="flex flex-col flex-1">
        <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
          {children}
        </div>
      </section>
    </>
  )
}
