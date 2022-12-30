import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { UNSUPPORTED_TOKEN_LIST_URLS } from '../constants'
import { TokenListsContext } from '../context'
import { WithTokenListsState } from '../types'

export function useActiveListUrls(context: TokenListsContext): string[] | undefined {
  const { reducerPath } = context
  const activeListUrls = useSelector((state: WithTokenListsState) => state[reducerPath].activeListUrls)
  return useMemo(() => activeListUrls?.filter((url) => !UNSUPPORTED_TOKEN_LIST_URLS.includes(url)), [activeListUrls])
}
