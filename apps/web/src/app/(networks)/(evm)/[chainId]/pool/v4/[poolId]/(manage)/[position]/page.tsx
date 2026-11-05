import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import type { ReactElement } from 'react'
import { parsePositionTokenId } from 'src/lib/wagmi/hooks/positions/position-token-id'
import { isHash } from 'viem'
import { V4PositionView } from './_ui/v4-position-view'

export default async function V4PositionPage(props: {
  params: Promise<{ chainId: string; poolId: string; position: string }>
}): Promise<ReactElement> {
  const { chainId: _chainId, poolId, position } = await props.params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  const tokenId = parsePositionTokenId(position)
  if (tokenId === undefined) {
    return notFound()
  }

  return <V4PositionView chainId={chainId} poolId={poolId} tokenId={tokenId} />
}
