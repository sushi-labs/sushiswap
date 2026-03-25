import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Providers } from './providers'
import { TwapLayout } from '../_ui/twap-layout'

export const metadata: Metadata = {
  title: 'Stop Loss',
  description: 'Trade with stop loss orders on SushiSwap.',
}

export default async function SwapStopLossLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = Number(params.chainId)
  if (!Number.isFinite(chainId)) notFound()

  return (
    <Providers>
      <TwapLayout chainId={chainId}>{children}</TwapLayout>
    </Providers>
  )
}
