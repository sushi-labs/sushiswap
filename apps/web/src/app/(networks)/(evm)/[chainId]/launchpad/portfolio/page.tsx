import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLaunchpadChainId } from '../constants'
import { PortfolioPage } from './_ui/portfolio-page'

export const metadata: Metadata = {
  title: 'Launchpad Portfolio',
  description:
    'View launchpad token holdings and performance for your connected wallet.',
}

export default async function LaunchpadPortfolioPage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <PortfolioPage chainId={chainId} />
}
