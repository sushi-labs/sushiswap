import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isSupportedChainId } from 'src/config'
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
  const { children } = props

  if (!isSupportedChainId) {
    return notFound()
  }

  return (
    <Providers>
      <main className="lg:p-4 mt-16 mb-[86px]">{children}</main>
    </Providers>
  )
}
