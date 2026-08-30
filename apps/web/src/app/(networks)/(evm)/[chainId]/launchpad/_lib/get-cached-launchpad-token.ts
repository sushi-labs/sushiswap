import { getLaunchpadToken } from '@sushiswap/graph-client/data-api'
import { cacheLife } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

const LAUNCHPAD_TOKEN_REVALIDATE_SECONDS = 60 * 60

class LaunchpadTokenNotFoundError extends Error {}

async function getCachedLaunchpadTokenOrThrow({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  'use cache'
  cacheLife({ revalidate: LAUNCHPAD_TOKEN_REVALIDATE_SECONDS })

  const token = await getLaunchpadToken({ chainId, address }, { retries: 3 })
  if (!token) throw new LaunchpadTokenNotFoundError()

  return token
}

export async function getCachedLaunchpadToken({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  try {
    return await getCachedLaunchpadTokenOrThrow({ chainId, address })
  } catch (error) {
    if (error instanceof LaunchpadTokenNotFoundError) return null
    throw error
  }
}
