import { SidebarProvider, TronSidebarContainer } from 'src/ui/sidebar'
import { Header } from '~tron/header'
import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap on Tron',
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
        <TronSidebarContainer>
          <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
        </TronSidebarContainer>
      </SidebarProvider>
    </Providers>
  )
}
