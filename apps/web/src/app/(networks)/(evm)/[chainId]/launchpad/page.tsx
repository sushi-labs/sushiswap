import { notFound } from 'next/navigation'
import { LaunchpadHomePage } from './_ui/launchpad-home-page'
import { isLaunchpadChainId } from './constants'

export default async function LaunchpadPage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <LaunchpadHomePage chainId={chainId} />
}
