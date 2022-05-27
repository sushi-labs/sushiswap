import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useTokensFromMap } from '@sushiswap/redux-token-lists/hooks'
import { useCombinedActiveList } from 'lib/state/token-lists'

export function useTokens(chainId: ChainId): { [address: string]: Token } {
  return useTokensFromMap(chainId, useCombinedActiveList())
}
