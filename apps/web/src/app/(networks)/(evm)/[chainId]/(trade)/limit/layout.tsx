import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { COW_LIMIT_CHAIN_IDS, isCowLimitChainId } from 'src/lib/swap/cow/chains'
import { isTwapSupportedChainId } from 'src/lib/swap/twap/supported-chain-ids'
import { getEvmChainById } from 'sushi/evm'
import { getStaticChainParams } from '~evm/[chainId]/get-static-chain-params'
import { CowLimitLayout } from './_ui/cow-limit-layout'

export const metadata: Metadata = {
  title: 'Limit',
  description: 'Create and manage CoW Protocol limit orders on Sushi.',
}

export function generateStaticParams(): ReturnType<
  typeof getStaticChainParams
> {
  return getStaticChainParams(COW_LIMIT_CHAIN_IDS)
}

export default async function LimitLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}): Promise<React.JSX.Element> {
  const chainId = Number((await params).chainId)
  if (!isCowLimitChainId(chainId)) {
    // Keep old links to the Orbs limit page working on chains CoW lacks.
    if (isTwapSupportedChainId(chainId))
      redirect(`/${getEvmChainById(chainId).key}/limit-legacy`)
    notFound()
  }

  return <CowLimitLayout chainId={chainId}>{children}</CowLimitLayout>
}
