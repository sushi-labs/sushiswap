import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChainId } from 'sushi/chain'
import {
  SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS,
  isSushiXSwap2ChainId,
} from 'sushi/config'
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

  const chainId = +params.chainId as ChainId

  if (!isSushiXSwap2ChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers chainId={chainId}>
      <SidebarContainer
        selectedNetwork={chainId}
        supportedNetworks={SUSHIXSWAP_2_SUPPORTED_CHAIN_IDS}
        unsupportedNetworkHref="/ethereum/cross-chain-swap"
      >
        <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
      </SidebarContainer>
    </Providers>
  )
}
