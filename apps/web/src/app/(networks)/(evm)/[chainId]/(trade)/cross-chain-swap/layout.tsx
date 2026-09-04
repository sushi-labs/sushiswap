import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLifiXSwapSupportedChainId } from 'src/config'
import { LIFI_XSWAP_SUPPORTED_CHAIN_IDS, getSortedChainIds } from 'src/config'
import { isNearIntentsChainId } from 'src/lib/swap/near-intents'
import { NEAR_INTENTS_SUPPORTED_CHAIN_IDS } from 'src/lib/swap/near-intents'
import { StellarChainId } from 'sushi/stellar'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { Header as StellarHeader } from '~stellar/header'
import { Header } from '../header'
import { Providers } from './providers'

const CROSS_CHAIN_SWAP_NETWORKS = getSortedChainIds([
  ...LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  ...NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
])

export const metadata: Metadata = {
  title: 'Cross-Chain Swap',
  description:
    'Swap assets across multiple blockchains with ease using Cross-Chain Swap. Enjoy secure, seamless cross-chain swaps for a streamlined DeFi experience on Sushi.com.',
}

export function generateStaticParams() {
  return getStaticChainParams(CROSS_CHAIN_SWAP_NETWORKS)
}

export default async function CrossChainSwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId

  if (!isLifiXSwapSupportedChainId(chainId) && !isNearIntentsChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers chainId={chainId}>
      {chainId === StellarChainId.STELLAR ? (
        <StellarHeader networks={CROSS_CHAIN_SWAP_NETWORKS} />
      ) : (
        <Header chainId={chainId} networks={CROSS_CHAIN_SWAP_NETWORKS} />
      )}
      <main className="lg:p-4 mt-16 mb-[86px] h-[clamp(600px,_calc(100vh_-_280px),_800px)]">
        {children}
      </main>
    </Providers>
  )
}
