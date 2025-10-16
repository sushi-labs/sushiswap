import {
  type BladeChainId,
  getBladePool,
} from '@sushiswap/graph-client/data-api-blade-prod'
import { unstable_cache } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'

export const getCachedBladePool = (
  chainId: BladeChainId,
  address: EvmAddress,
) =>
  unstable_cache(
    async () => getBladePool({ chainId, address }),
    ['blade', 'pool', `${chainId}:${address}`],
    {
      revalidate: 15,
    },
  )()
