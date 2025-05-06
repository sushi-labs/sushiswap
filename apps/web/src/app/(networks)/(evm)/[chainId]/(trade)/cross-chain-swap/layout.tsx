import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { XSWAP_SUPPORTED_CHAIN_IDS, isXSwapSupportedChainId } from 'src/config'
import type { EvmChainId } from 'sushi/chain'
import { SidebarContainer } from '~evm/_common/ui/sidebar'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cross-Chain Swap',
  description:
    'Swap assets across multiple blockchains with ease using Cross-Chain Swap. Enjoy secure, seamless cross-chain swaps for a streamlined DeFi experience on Sushi.com.',
}

export default async function CrossChainSwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params

  const { children } = props

  const chainId = +params.chainId as EvmChainId

  if (!isXSwapSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers chainId={chainId}>
      <SidebarContainer
        selectedNetwork={chainId}
        supportedNetworks={XSWAP_SUPPORTED_CHAIN_IDS}
        unsupportedNetworkHref="/ethereum/cross-chain-swap"
      >
        <main className="lg:p-4 mt-16 mb-[86px] h-[clamp(600px,_calc(100vh_-_280px),_800px)]">
          {children}
        </main>
      </SidebarContainer>
    </Providers>
  )
}
