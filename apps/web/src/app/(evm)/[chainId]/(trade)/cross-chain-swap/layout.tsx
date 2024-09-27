import { SidebarContainer } from 'src/ui/sidebar'
import { SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS } from 'sushi/config'
import { Providers } from './providers'

export default function CrossChainSwapLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarContainer supportedNetworks={SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS}>
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
