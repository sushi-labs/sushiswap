import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  CROSSMINT_SUPPORTED_CHAIN_IDS,
  isCrossmintSupportedChainId,
} from 'src/config'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { Header } from '../header'

export const metadata: Metadata = {
  title: 'Fiat',
  description:
    'Buy memecoins and USDC directly with Apple Pay, Google Pay, Card, and more.',
}

export function generateStaticParams() {
  return getStaticChainParams(CROSSMINT_SUPPORTED_CHAIN_IDS)
}

export default async function SwapLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId

  if (!isCrossmintSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <>
      <Header networks={CROSSMINT_SUPPORTED_CHAIN_IDS} chainId={chainId} />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </>
  )
}
