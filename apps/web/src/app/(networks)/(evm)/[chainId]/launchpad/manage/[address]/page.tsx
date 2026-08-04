import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { isLaunchpadChainId } from '../../constants'
import { ManageTokenPage } from './_ui/manage-token-page'

export const metadata: Metadata = {
  title: 'Manage launch',
  description:
    'Update metadata and collect fees for a token your wallet launched.',
  // Creator-only tooling, so there is nothing here worth indexing.
  robots: { index: false, follow: true },
}

export default async function ManageTokenRoute({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  return <ManageTokenPage chainId={chainId} address={address as EvmAddress} />
}
