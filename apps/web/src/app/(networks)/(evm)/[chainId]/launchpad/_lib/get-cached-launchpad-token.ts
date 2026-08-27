import {
  type LaunchpadToken,
  getLaunchpadToken,
} from '@sushiswap/graph-client/data-api'
import { unstable_cache } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

class LaunchpadTokenNotFoundError extends Error {}

export type LaunchpadTokenIdentity = Pick<
  LaunchpadToken,
  | 'address'
  | 'chainId'
  | 'creator'
  | 'decimals'
  | 'name'
  | 'provider'
  | 'symbol'
>

function getLaunchpadTokenIdentity(
  token: LaunchpadToken,
): LaunchpadTokenIdentity {
  return {
    address: token.address,
    chainId: token.chainId,
    creator: token.creator,
    decimals: token.decimals,
    name: token.name,
    provider: token.provider,
    symbol: token.symbol,
  }
}

export async function getCachedLaunchpadToken({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}): Promise<LaunchpadToken | null> {
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

export async function getCachedLaunchpadTokenIdentity({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}): Promise<LaunchpadTokenIdentity | null> {
  const getCachedIdentity = unstable_cache(
    async () => {
      const token = await getCachedLaunchpadToken({ chainId, address })
      if (!token) throw new LaunchpadTokenNotFoundError()

      return getLaunchpadTokenIdentity(token)
    },
    ['launchpad', 'token-identity', `${chainId}:${address}`],
    { revalidate: false },
  )

  try {
    return await getCachedIdentity()
  } catch (error) {
    if (error instanceof LaunchpadTokenNotFoundError) return null
    throw error
  }
}
