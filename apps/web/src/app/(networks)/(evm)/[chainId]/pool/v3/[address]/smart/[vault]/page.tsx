import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { type EvmChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import { isAddress } from 'viem'
import { SmartVault } from '~evm/[chainId]/pool/_ui/smart/smart-vault'
import { getCachedV3Pool } from '../../_lib/get-cached-v3-pool'

export default async function SteerVaultPage(props: {
  params: Promise<{ chainId: string; vault: string; address: string }>
}) {
  const params = await props.params
  const chainId = Number(params.chainId) as EvmChainId
  const vaultAddress = params.vault
  const poolAddress = params.address

  if (
    !isSushiSwapV3ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(poolAddress, { strict: false }) ||
    !isAddress(vaultAddress, { strict: false })
  ) {
    return notFound()
  }

  const pool = await getCachedV3Pool({ chainId, address: poolAddress })

  if (!pool) {
    return notFound()
  }

  return (
    <SmartVault
      chainId={chainId}
      vaultAddress={vaultAddress}
      poolAddress={poolAddress}
      pool={pool}
    />
  )
}
