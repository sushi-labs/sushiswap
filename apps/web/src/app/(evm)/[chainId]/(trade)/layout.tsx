import { SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export default function TradeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <Header />
        {children}
      </SidebarProvider>
    </Providers>
  )
}
