import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { isHash } from 'viem'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { NewV4Position } from './_ui/new-v4-position'

export default async function V4PositionCreatePage(props: {
  params: Promise<{ chainId: string; poolId: string }>
}): Promise<ReactElement> {
  const { chainId: _chainId, poolId } = await props.params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  return (
    <ConcentratedLiquidityProvider>
      <NewV4Position chainId={chainId} poolId={poolId} />
    </ConcentratedLiquidityProvider>
  )
}
