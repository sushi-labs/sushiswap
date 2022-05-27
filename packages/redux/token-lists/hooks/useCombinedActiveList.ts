import { TokenListsContext } from '../context'
import { TokenAddressMap } from '../types'
import { useActiveListUrls } from './useActiveListUrls'
import { useCombinedTokenMapFromUrls } from './useCombinedTokenMapFromUrls'

export function useCombinedActiveList(context: TokenListsContext): TokenAddressMap {
  const activeListUrls = useActiveListUrls(context)

  const activeTokens = useCombinedTokenMapFromUrls(context, activeListUrls)

  return activeTokens
}
