import { HotJar, Sidebar, SidebarProvider } from '@sushiswap/ui'

import { isSupportedChainId } from 'src/config'
import { Header } from '../header'
import notFound from './not-found'
import { Providers } from './providers'

export default function PoolLayout({
  children,
  params: { chainId },
}: { children: React.ReactNode; params: { chainId: string } }) {
  if (!isSupportedChainId(+chainId)) {
    return notFound()
  }

  return (
    <>
      <Providers>
        <SidebarProvider defaultOpen>
          <Header />
          <div className="relative top-20">
            <Sidebar />
            <div className="flex flex-col h-full flex-1">{children}</div>
          </div>
        </SidebarProvider>
      </Providers>
      <HotJar />
    </>
  )
}
