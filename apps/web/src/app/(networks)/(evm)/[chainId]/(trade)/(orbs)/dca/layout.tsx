import type { Metadata } from 'next'
import { Providers } from './providers'
import { TwapLayout } from '../_ui/twap-layout'

export const metadata: Metadata = {
  title: 'DCA',
  description:
    "Dollar-cost average into your favorite tokens with SushiSwap's DCA tool.",
}

export default async function SwapDCALayout(props: {
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
