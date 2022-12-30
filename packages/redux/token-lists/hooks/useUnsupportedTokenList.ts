import { useMemo } from 'react'

import { UNSUPPORTED_TOKEN_LIST_URLS } from '../constants'
import { TokenListsContext } from '../context'
import { combineMaps, listToTokenMap } from '../functions'
import { TokenAddressMap } from '../types'
import UNSUPPORTED_TOKEN_LIST from '../unsupported.tokenlist.json'
import { useCombinedTokenMapFromUrls } from './useCombinedTokenMapFromUrls'

export function useUnsupportedTokenList(context: TokenListsContext): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(context, UNSUPPORTED_TOKEN_LIST_URLS)

  // format into one token address map
  return useMemo(
    () => combineMaps(localUnsupportedListMap, loadedUnsupportedListMap),
    [localUnsupportedListMap, loadedUnsupportedListMap]
  )
}
