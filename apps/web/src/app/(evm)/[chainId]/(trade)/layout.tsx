import { SidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export default function TradeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <Header />
        <SidebarContainer>
          <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
        </SidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
