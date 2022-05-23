import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useCombinedActiveList } from 'lib/state/token-lists'

import { useTokensFromMap } from './useTokensFromMap'

export function useTokens(chainId: ChainId): { [address: string]: Token } {
  return useTokensFromMap(chainId, useCombinedActiveList())
}
