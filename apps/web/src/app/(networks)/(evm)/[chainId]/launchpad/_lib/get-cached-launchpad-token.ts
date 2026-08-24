import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

export function getCachedLaunchpadToken({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  return unstable_cache(
    async () => getLaunchpadToken({ chainId, address }, { retries: 3 }),
    ['launchpad', 'token', `${chainId}:${address}`],
    { revalidate: 60 },
  )()
}
