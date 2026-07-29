import { notFound } from 'next/navigation'
import { isLaunchpadChainId } from '../constants'
import { CreateLaunchPage } from './_ui/create-launch-page'

export default async function CreatePage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadChainId(chainId)) return notFound()

  return <CreateLaunchPage chainId={chainId} />
}
