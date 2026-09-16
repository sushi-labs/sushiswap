import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLaunchpadV2ChainId } from 'sushi/evm'
import { ManageLaunchesPage } from './_ui/manage-launches-page'

export const metadata: Metadata = {
  title: 'Manage your launches',
  description:
    'Update metadata and collect fees for the tokens your wallet launched.',
  // Wallet-specific, so there is nothing here worth indexing.
  robots: { index: false, follow: true },
}

export default async function ManagePage({
  params,
}: {
  params: Promise<{ chainId: string }>
}) {
  const chainId = Number((await params).chainId)
  if (!isLaunchpadV2ChainId(chainId)) return notFound()

  return <ManageLaunchesPage chainId={chainId} />
}
