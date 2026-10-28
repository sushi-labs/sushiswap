import {
  isSmartPoolChainId,
  isSushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { isAddress, isHash } from 'viem'
import { SmartVault } from '~evm/[chainId]/pool/_ui/smart/smart-vault'
import { getCachedV4Pool } from '../../_lib/get-cached-v4-pool'

export default async function SteerVaultPage(props: {
  params: Promise<{ chainId: string; vault: string; poolId: string }>
}) {
  const params = await props.params
  const chainId = Number(params.chainId)
  const { vault: vaultAddress, poolId } = params

  if (
    !isSushiSwapV4ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isHash(poolId) ||
    !isAddress(vaultAddress, { strict: false })
  ) {
    return notFound()
  }

  const pool = await getCachedV4Pool({ chainId, poolId })

  if (!pool) {
    return notFound()
  }

  return (
    <SmartVault
      chainId={chainId}
      vaultAddress={vaultAddress}
      poolAddress={poolId}
      pool={pool}
    />
  )
}
