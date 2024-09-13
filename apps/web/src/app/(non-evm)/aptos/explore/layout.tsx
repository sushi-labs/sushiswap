import { Container } from '@sushiswap/ui'
import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Hero } from './hero'
import { Providers } from './providers'

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Header />
      <AptosSidebarContainer shiftContent>
        <main className="flex flex-col h-full flex-1">
          <Container maxWidth="7xl" className="px-4 py-[9.5rem]">
            <Hero />
          </Container>
          <section className="flex flex-col min-h-screen gap-4 pb-10">
            <Providers>{children}</Providers>
          </section>
        </main>
      </AptosSidebarContainer>
    </SidebarProvider>
  )
}
