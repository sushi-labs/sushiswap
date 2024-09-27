import { TWAP_SUPPORTED_NETWORKS } from 'src/config'
import { SidebarContainer } from 'src/ui/sidebar'
import { Providers } from './providers'

export default function SwapDCALayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarContainer
        supportedNetworks={TWAP_SUPPORTED_NETWORKS}
        unsupportedNetworkHref="/ethereum/dca"
      >
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
