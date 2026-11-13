import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  UNIFIED_SWAP_CHAIN_IDS,
  isUnifiedSwapChainId,
} from 'src/lib/swap/unified-swap'
import { isEvmChainId } from 'sushi/evm'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { Header } from '../header'

export const metadata: Metadata = {
  title: 'Swap',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export function generateStaticParams() {
  return getStaticChainParams(
    UNIFIED_SWAP_CHAIN_IDS.filter((chainId) => isEvmChainId(chainId)),
  )
}

export default async function SwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId

  if (!isUnifiedSwapChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header chainId={chainId} />
      <main className="lg:p-4 mt-8 lg:mt-16 mb-[86px]">{children}</main>
    </>
  )
}
