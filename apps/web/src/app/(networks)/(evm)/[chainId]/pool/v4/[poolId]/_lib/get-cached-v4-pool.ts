import {
  type SushiSwapV4ChainId,
  getV4Pool,
  isSushiSwapV4ChainId,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import { type Hex, isHash } from 'viem'

export async function getCachedV4Pool({
  chainId,
  poolId,
}: { chainId: SushiSwapV4ChainId; poolId: Hex }) {
  return unstable_cache(
    async () => getV4Pool({ chainId, poolId }, { retries: 3 }),
    ['v4', 'pool', `${chainId}:${poolId}`],
    {
      revalidate: 60 * 15,
    },
  )()
}

/** The V4 pool a page's route params name; renders not found without one. */
export async function getV4PoolOrNotFound(
  params: Promise<{ chainId: string; poolId: string }>,
): Promise<{
  poolId: Hex
  pool: NonNullable<Awaited<ReturnType<typeof getCachedV4Pool>>>
}> {
  const { chainId: _chainId, poolId } = await params
  const chainId = +_chainId
  if (!isSushiSwapV4ChainId(chainId) || !isHash(poolId)) notFound()

  const pool = await getCachedV4Pool({ chainId, poolId })
  if (!pool) notFound()

  return { poolId, pool }
}
