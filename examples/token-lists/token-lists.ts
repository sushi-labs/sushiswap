import { createTokenLists } from '@sushiswap/redux-token-lists'

// Create a token lists instance with default settings
export const tokenLists = createTokenLists()

export const {
  useAllLists,
  useActiveListUrls,
  useInactiveListUrls,
  useCombinedActiveList,
  useUnsupportedTokenList,
  useIsListActive,
  useFetchListCallback,
} = tokenLists.hooks
