import { Container } from '@sushiswap/ui'
import { HotJar } from '@sushiswap/ui'
import { SidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { BarHeader } from 'src/ui/stake'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'Stake',
  description: 'Stake SUSHI in the SushiBar to earn more SUSHI.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <SidebarProvider defaultOpen>
          <Header />
          <SidebarContainer shiftContent>
            <main className="flex flex-col flex-1">
              <Container maxWidth="5xl" className="px-4 pt-16 pb-8">
                <BarHeader />
              </Container>
              <section className="flex flex-col flex-1 pb-10">
                {children}
              </section>
            </main>
          </SidebarContainer>
        </SidebarProvider>
      </Providers>
      <HotJar />
    </>
  )
}
