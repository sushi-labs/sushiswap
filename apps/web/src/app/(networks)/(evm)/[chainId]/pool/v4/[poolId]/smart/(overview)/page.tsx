import {
  isSmartPoolChainId,
  isSushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { isHash } from 'viem'
import { SmartVaultsOverview } from '~evm/[chainId]/pool/_ui/smart/smart-vaults-overview'
import { getCachedV4Pool } from '../../_lib/get-cached-v4-pool'

export default async function VaultOverviewPage(props: {
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (
    !isSushiSwapV4ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isHash(poolId)
  ) {
    return notFound()
  }

  const pool = await getCachedV4Pool({ chainId, poolId })

  if (!pool) {
    return notFound()
  }

  return (
    <SmartVaultsOverview chainId={chainId} poolAddress={poolId} pool={pool} />
  )
}
