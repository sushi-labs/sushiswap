import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLaunchpadChainId } from '../constants'
import { ManualLaunchPage } from './_ui/manual-launch-page'

export const metadata: Metadata = {
  title: 'Manual token launch',
  description:
    'Deploy a fixed-supply SushiLaunchpadToken directly to your wallet.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ManualLaunchRoute({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <ManualLaunchPage chainId={chainId} />
}
