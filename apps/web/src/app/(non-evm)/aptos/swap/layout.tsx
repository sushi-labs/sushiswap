import { AptosSidebarContainer, SidebarProvider } from 'src/ui/sidebar'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Aptos',
  description:
    'SushiSwap is a community-driven decentralized exchange (DEX) for traders and liquidity providers.',
}

export default function SwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <Header />
        <AptosSidebarContainer>
          <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
        </AptosSidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
