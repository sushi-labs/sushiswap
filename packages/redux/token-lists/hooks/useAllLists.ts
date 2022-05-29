import { useSelector } from 'react-redux'

import { TokenListsContext } from '../context'
import { WithTokenListsState, TokenListState } from '../types'

export function useAllLists(context: TokenListsContext) {
  const { reducerPath } = context
  return useSelector((state: WithTokenListsState) => state[reducerPath].byUrl)
}
