import { useSelector } from 'react-redux'

import { TokenListsContext } from '../context'
import { WithTokenListsState } from '../types'

export function useAllLists(context: TokenListsContext) {
  const { reducerPath } = context
  return useSelector(function (state: WithTokenListsState) {
    return state[reducerPath].byUrl
  })
}
