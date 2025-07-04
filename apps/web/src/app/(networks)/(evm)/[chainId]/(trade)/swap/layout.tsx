import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isSupportedChainId } from 'src/config'
import { Header } from '../header'
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
  const chainId = +params.chainId

  if (!isSupportedChainId(chainId)) {
    return notFound()
  }

  return (
    <Providers>
      <Header chainId={chainId} />
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </Providers>
  )
}
