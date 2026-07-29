import { ChainId } from 'sushi'

export const LAUNCHPAD_SUPPORTED_CHAIN_IDS = [ChainId.ROBINHOOD] as const

export type LaunchpadChainId = (typeof LAUNCHPAD_SUPPORTED_CHAIN_IDS)[number]

export function isLaunchpadChainId(
  chainId: number,
): chainId is LaunchpadChainId {
  return LAUNCHPAD_SUPPORTED_CHAIN_IDS.some(
    (supportedChainId) => supportedChainId === chainId,
  )
}
