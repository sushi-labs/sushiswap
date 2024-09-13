import { isSupportedChainId } from 'src/config'
import { SidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import notFound from '../not-found'

export default function PoolLayout({
  children,
  params: { chainId },
}: { children: React.ReactNode; params: { chainId: string } }) {
  if (!isSupportedChainId(+chainId)) {
    return notFound()
  }

  return (
    <SidebarProvider defaultOpen>
      <Header />
      <SidebarContainer shiftContent>
        <main className="flex flex-col h-full flex-1">{children}</main>
      </SidebarContainer>
    </SidebarProvider>
  )
}
