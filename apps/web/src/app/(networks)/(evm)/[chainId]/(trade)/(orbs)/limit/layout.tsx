import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TWAP_SUPPORTED_CHAIN_IDS, isTwapSupportedChainId } from 'src/config'
import { Header } from '../../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Limit',
  description: 'Trade with limit orders on SushiSwap.',
}

export default async function SwapLimitLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId

  if (!isTwapSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} supportedNetworks={TWAP_SUPPORTED_CHAIN_IDS} />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </Providers>
  )
}
