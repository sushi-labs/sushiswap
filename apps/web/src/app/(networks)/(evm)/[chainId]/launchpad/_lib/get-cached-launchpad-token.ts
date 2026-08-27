import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

class LaunchpadTokenNotFoundError extends Error {}

export async function getCachedLaunchpadToken({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  const getCachedToken = unstable_cache(
    async () => {
      const token = await getLaunchpadToken(
        { chainId, address },
        { retries: 3 },
      )
      if (!token) throw new LaunchpadTokenNotFoundError()

      return token
    },
    ['launchpad', 'token', `${chainId}:${address}`],
    { revalidate: 60 },
  )

  try {
    return await getCachedToken()
  } catch (error) {
    if (error instanceof LaunchpadTokenNotFoundError) return null
    throw error
  }
}
