import { ChainId } from 'sushi'

export const NEAR_INTENTS_API_URL = 'https://1click.chaindefuser.com'

export const NEAR_INTENTS_CHAIN_IDS = [
  ChainId.ARBITRUM,
  ChainId.BASE,
  ChainId.BERACHAIN,
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.GNOSIS,
  ChainId.OPTIMISM,
  ChainId.PLASMA,
  ChainId.POLYGON,
  ChainId.AVALANCHE,
  ChainId.MONAD,
  ChainId.XLAYER,
  ChainId.STELLAR,
] as const

export type NearIntentsChainId = (typeof NEAR_INTENTS_CHAIN_IDS)[number]

export const isNearIntentsChainId = (
  chainId: number,
): chainId is NearIntentsChainId => {
  return NEAR_INTENTS_CHAIN_IDS.includes(chainId as NearIntentsChainId)
}
