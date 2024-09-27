import { TWAP_SUPPORTED_NETWORKS } from 'src/config'
import { SidebarContainer } from 'src/ui/sidebar'
import { Providers } from './providers'

export default function SwapLimitLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarContainer
        supportedNetworks={TWAP_SUPPORTED_NETWORKS}
        unsupportedNetworkHref="/ethereum/limit"
      >
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
