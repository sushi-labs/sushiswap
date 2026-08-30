import { getLaunchpadTokenDefinition } from '@sushiswap/graph-client/data-api'
import { cacheLife } from 'next/cache'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../constants'

// The fields are immutable, but the launch itself can still be orphaned by a
// reorg, so periodically revalidate its existence.
const LAUNCHPAD_TOKEN_DEFINITION_REVALIDATE_SECONDS = 60 * 60

class LaunchpadTokenDefinitionNotFoundError extends Error {}

async function getCachedLaunchpadTokenDefinitionOrThrow({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  'use cache'
  cacheLife({ revalidate: LAUNCHPAD_TOKEN_DEFINITION_REVALIDATE_SECONDS })

  const definition = await getLaunchpadTokenDefinition(
    { chainId, address },
    { retries: 3 },
  )
  if (!definition) throw new LaunchpadTokenDefinitionNotFoundError()

  return definition
}

export async function getCachedLaunchpadTokenDefinition({
  chainId,
  address,
}: {
  chainId: LaunchpadChainId
  address: EvmAddress
}) {
  try {
    return await getCachedLaunchpadTokenDefinitionOrThrow({ chainId, address })
  } catch (error) {
    if (error instanceof LaunchpadTokenDefinitionNotFoundError) return null
    throw error
  }
}
