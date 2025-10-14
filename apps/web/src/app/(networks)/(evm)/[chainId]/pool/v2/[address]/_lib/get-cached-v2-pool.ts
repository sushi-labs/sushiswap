import { getV2Pool } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { EvmAddress, SushiSwapV2ChainId } from 'sushi/evm'

export function getCachedV2Pool({
  chainId,
  address,
}: { chainId: SushiSwapV2ChainId; address: EvmAddress }) {
  return unstable_cache(
    async () => getV2Pool({ chainId, address }, { retries: 3 }),
    ['v2', 'pool', `${chainId}:${address}`],
    {
      revalidate: 60 * 15,
    },
  )()
}
