import type { Metadata } from 'next'
import type { ChainId as ChainIdType } from 'sushi/chain'
import { Header } from '../header'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Trade crypto effortlessly with SushiSwap, supporting over 30 chains and featuring a powerful aggregator for the best rates across DeFi.',
}

export default async function PortfolioLayout(props: {
  children: React.ReactNode
  params: Promise<{
    chainId: string
  }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = +params.chainId as ChainIdType

  return (
    <Providers>
      <Header chainId={chainId} />
      {children}
    </Providers>
  )
}
