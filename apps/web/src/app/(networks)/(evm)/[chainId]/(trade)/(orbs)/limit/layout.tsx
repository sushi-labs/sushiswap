import type { Metadata } from 'next'
import { TwapLayout } from '../_ui/twap-layout'
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

  return (
    <Providers>
      <TwapLayout chainId={chainId}>{children}</TwapLayout>
    </Providers>
  )
}
