import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/core-sdk'
import { TokenList } from '@uniswap/token-lists'
import { getTokenList } from 'app/functions/list'
import { useAppDispatch } from 'app/state/hooks'
import { fetchTokenList } from 'app/state/lists/actions'
import { useCallback } from 'react'
import { useEnsResolveName, useNetwork, useProvider } from 'wagmi'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const provider = useProvider()
  const [{ data: network }] = useNetwork()
  const chainId = network?.chain?.id
  const dispatch = useAppDispatch()
  const [, resolveName] = useEnsResolveName({
    skip: true,
  })

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!provider || chainId !== ChainId.ETHEREUM) {
        if (chainId === ChainId.ETHEREUM) {
          if (network) {     
            return resolveName({name: ensName})
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveName({ name: ensName })
    },
    [chainId, provider, network, resolveName],
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch &&
            dispatch(
              fetchTokenList.rejected({
                url: listUrl,
                requestId,
                errorMessage: error.message,
              }),
            )
          throw error
        })
    },
    [dispatch, ensResolver],
  )
}
