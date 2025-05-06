import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_NETWORKS, isSupportedChainId } from 'src/config'
import type { ChainId } from 'sushi/chain'
import { SidebarContainer } from '~evm/_common/ui/sidebar'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Swap',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function SwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as ChainId

  if (!isSupportedChainId) {
    return notFound()
  }

  return (
    <Providers>
      <SidebarContainer
        selectedNetwork={chainId}
        supportedNetworks={SUPPORTED_NETWORKS}
        unsupportedNetworkHref="/ethereum/swap"
      >
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
