import { getV3Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { EvmAddress, SushiSwapV3ChainId } from 'sushi/evm'

export async function getCachedV3Pool({
  chainId,
  address,
}: { chainId: SushiSwapV3ChainId; address: EvmAddress }) {
  return unstable_cache(
    async () => getV3Pool({ chainId, address }, { retries: 3 }),
    ['v3', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()
}
