import { Container } from '@sushiswap/ui'

import { Header } from './header'
import { Providers } from './providers'

export const metadata = {
  title: 'Home 🏠',
}

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <Container maxWidth="7xl" className="mx-auto px-4 pt-[80px]">
        <h1 className="text-4xl text-center font-semibold">
          DeFi made <span className="font-semibold">simple</span>
        </h1>
        <section className="grid grid-cols-3 gap-4">
          <div className="p-4 text-center">Trade Card</div>
          <div className="p-4 text-center">Pool Card</div>
          <div className="p-4 text-center">Stake Card</div>
        </section>
      </Container>
      <Container maxWidth="6xl" className="mx-auto px-4 text-center">
        Smart Pools Table
      </Container>
      {children}
    </Providers>
  )
}
