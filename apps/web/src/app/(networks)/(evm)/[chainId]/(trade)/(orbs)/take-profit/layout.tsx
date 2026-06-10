import type { Metadata } from 'next'
import { TwapLayout } from '../_ui/twap-layout'

export const metadata: Metadata = {
  title: 'Take Profit',
  description: 'Trade with take profit orders on SushiSwap.',
}

export default async function SwapTakeProfitLayout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string }>
}) {
  const params = await props.params
  const { children } = props
  const chainId = Number(params.chainId)

  return <TwapLayout chainId={chainId}>{children}</TwapLayout>
}
