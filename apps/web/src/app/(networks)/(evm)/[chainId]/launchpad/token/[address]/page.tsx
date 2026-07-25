import { notFound } from 'next/navigation'
import type { EvmAddress } from 'sushi/evm'
import { isAddress } from 'viem'
import { isLaunchpadChainId } from '../../constants'
import { TokenDetailPage } from './_ui/token-detail-page'

export default async function LaunchpadTokenPage({
  params,
}: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const { chainId: chainIdParam, address } = await params
  const chainId = Number(chainIdParam)

  if (!isLaunchpadChainId(chainId) || !isAddress(address, { strict: false })) {
    return notFound()
  }

  return <TokenDetailPage chainId={chainId} address={address as EvmAddress} />
}
