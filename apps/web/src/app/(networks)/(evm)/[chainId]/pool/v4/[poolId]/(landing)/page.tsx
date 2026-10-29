import { isSushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { notFound } from 'next/navigation'
import { isHash } from 'viem'
import { getCachedV4Pool } from '../_lib/get-cached-v4-pool'
import { PoolPageV4 } from './_ui/pool-page-v4'

export default async function PoolPage(props: {
  params: Promise<{ chainId: string; poolId: string }>
}) {
  const params = await props.params
  const { chainId: _chainId, poolId } = params
  const chainId = +_chainId

  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) {
    return notFound()
  }

  const pool = (await getCachedV4Pool({ chainId, poolId }))!

  return <PoolPageV4 pool={pool} />
}
