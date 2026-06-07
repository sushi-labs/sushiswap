import type { Metadata } from 'next'
import { TwapLayout } from '../_ui/twap-layout'

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

  return <TwapLayout chainId={chainId}>{children}</TwapLayout>
}
