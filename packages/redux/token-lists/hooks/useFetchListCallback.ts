import { BaseProvider } from '@ethersproject/providers'
import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { TokenListsContext } from '../context'
import { getTokenList, resolveENSContentHash } from '../utils'

export function useFetchListCallback(
  context: TokenListsContext,
  provider: BaseProvider
): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { actions } = context
  const dispatch = useDispatch()

  const ensResolver = useCallback((ensName: string) => resolveENSContentHash(ensName, provider), [provider])

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(actions.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(actions.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              actions.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              })
            )
          throw error
        })
    },
    [actions, dispatch, ensResolver]
  )
}
