import { SidebarContainer } from 'src/ui/sidebar'
import { Providers } from './providers'

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarContainer>
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
