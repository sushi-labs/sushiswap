import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'Pool',
}

export default function PoolLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider defaultOpen>
        <Header />
        <AptosSidebarContainer shiftContent>
          <main className="flex flex-col h-full flex-1">{children}</main>
        </AptosSidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
