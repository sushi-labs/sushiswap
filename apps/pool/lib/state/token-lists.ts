import { createTokenLists } from '@sushiswap/redux-token-lists'

// Create a token lists instance with default settings
export const tokenLists: ReturnType<typeof createTokenLists> = createTokenLists()

export const {
  useAllLists,
  useActiveListUrls,
  useInactiveListUrls,
  useCombinedActiveList,
  useUnsupportedTokenList,
  useIsListActive,
  useFetchListCallback,
  useTokens,
} = tokenLists.hooks
