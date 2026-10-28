import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { type EvmChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { SmartVaultsOverview } from '~evm/[chainId]/pool/_ui/smart/smart-vaults-overview'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'

export default async function VaultOverviewPage(props: {
  params: Promise<{ chainId: string; address: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, address } = params
  const chainId = +_chainId as EvmChainId

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(address, { strict: false })
  ) {
    return notFound()
  }

  const pool = await getCachedV3Pool({ chainId, address })

  if (!pool) {
    return notFound()
  }

  return (
    <SmartVaultsOverview chainId={chainId} poolAddress={address} pool={pool} />
  )
}
