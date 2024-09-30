import { Container } from '@sushiswap/ui'
import { BarHeader } from 'src/ui/stake'
import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Stake',
  description: 'Stake SUSHI in the SushiBar to earn more SUSHI.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <Header />
        <div className="flex flex-col flex-1">
          <Container maxWidth="5xl" className="px-4 pt-16 mb-12">
            <BarHeader />
          </Container>
          <section className="flex flex-col flex-1">
            <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-9 pb-20 h-full">
              {children}
            </div>
          </section>
        </div>
      </Providers>
    </>
  )
}
