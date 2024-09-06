import { HotJar, Sidebar, SidebarProvider } from '@sushiswap/ui'
import { Header } from '../header'
import { Providers } from './providers'

export default function TradeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <SidebarProvider>
          <Header />
          <div className="relative top-20">
            <Sidebar />
            <div className="lg:p-4 mt-16 mb-[86px]">{children}</div>
          </div>
        </SidebarProvider>
      </Providers>
      <HotJar />
    </>
  )
}
