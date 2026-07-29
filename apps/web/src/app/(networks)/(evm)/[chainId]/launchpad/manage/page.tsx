import { notFound } from 'next/navigation'
import { isLaunchpadChainId } from '../constants'
import { ManageLaunchesPage } from './_ui/manage-launches-page'

export default async function ManagePage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <ManageLaunchesPage chainId={chainId} />
}
