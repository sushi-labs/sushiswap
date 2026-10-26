import { getV4Pool } from '@sushiswap/graph-client/data-api'
import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { Hex } from 'viem'

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
