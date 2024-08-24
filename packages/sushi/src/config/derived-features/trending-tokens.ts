import type { ChainId } from '../../chain/constants.js'
import {
  GECKOTERMINAL_SUPPORTED_CHAIN_IDS,
  type GeckoTerminalChainId,
} from '../features/geckoterminal.js'
import {
  SUSHISWAP_SUPPORTED_CHAIN_IDS,
  type SushiSwapChainId,
} from '../features/sushiswap.js'

export const TRENDING_TOKENS_SUPPORTED_CHAIN_IDS =
  SUSHISWAP_SUPPORTED_CHAIN_IDS.flatMap((chainId) => {
    if (
      GECKOTERMINAL_SUPPORTED_CHAIN_IDS.includes(
        chainId as GeckoTerminalChainId,
      )
    ) {
      return chainId
    }
    return []
  }) as TrendingTokensChainId[]

export const TrendingTokensChainIds = TRENDING_TOKENS_SUPPORTED_CHAIN_IDS

export type TrendingTokensChainId = GeckoTerminalChainId & SushiSwapChainId

export function isTrendingTokensChainId(
  chainId: ChainId,
): chainId is TrendingTokensChainId {
  return TRENDING_TOKENS_SUPPORTED_CHAIN_IDS.includes(
    chainId as TrendingTokensChainId,
  )
}
