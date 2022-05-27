import { useMemo } from 'react'

import { UNSUPPORTED_TOKEN_LIST_URLS } from '../constants'
import { TokenListsContext } from '../context'
import { useActiveListUrls } from './useActiveListUrls'
import { useAllLists } from './useAllLists'

export function useInactiveListUrls(context: TokenListsContext): string[] {
  const lists = useAllLists(context)
  const allActiveListUrls = useActiveListUrls(context)
  return useMemo(
    () =>
      Object.keys(lists).filter(
        (url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_TOKEN_LIST_URLS.includes(url)
      ),
    [lists, allActiveListUrls]
  )
}
