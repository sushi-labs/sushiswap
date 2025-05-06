import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TWAP_SUPPORTED_CHAIN_IDS, isTwapSupportedChainId } from 'src/config'
import type { ChainId } from 'sushi/chain'
import { SidebarContainer } from '~evm/_common/ui/sidebar'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'DCA',
  description:
    "Dollar-cost average into your favorite tokens with SushiSwap's DCA tool.",
}

export default async function SwapDCALayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  if (!isTwapSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <SidebarContainer
        selectedNetwork={chainId}
        supportedNetworks={TWAP_SUPPORTED_CHAIN_IDS}
        unsupportedNetworkHref="/ethereum/dca"
      >
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
