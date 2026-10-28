import {
  isSmartPoolChainId,
  isSushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { isAddress } from 'viem'
import { SmartVaultLayout } from '~evm/[chainId]/pool/_ui/smart/smart-vault'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ chainId: string; vault: string; poolId: string }>
}) {
  const params = await props.params
  const chainId = Number(params.chainId)

  if (
    !isSushiSwapV4ChainId(chainId) ||
    !isSmartPoolChainId(chainId) ||
    !isAddress(params.vault, { strict: false })
  ) {
    return notFound()
  }

  return (
    <SmartVaultLayout chainId={chainId} vaultAddress={params.vault}>
      {props.children}
    </SmartVaultLayout>
  )
}
