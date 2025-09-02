import {
  type BladeChainId,
  getBladePool,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'

export const getCachedBladePool = (
  chainId: BladeChainId,
  address: `0x${string}`,
) =>
  unstable_cache(
    async () => getBladePool({ chainId, address }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: 15,
    },
  )()
