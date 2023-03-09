import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'

import { TokenListsContext } from '../context'
import { useCombinedActiveList } from './useCombinedActiveList'
import { useTokensFromMap } from './useTokensFromMap'

export function useTokens(context: TokenListsContext, chainId: ChainId | undefined): { [address: string]: Token } {
  return useTokensFromMap(chainId, useCombinedActiveList(context))
}
