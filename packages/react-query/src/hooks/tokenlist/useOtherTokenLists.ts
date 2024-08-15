import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { Token } from 'sushi/currency'
import { isAddress } from 'viem'

import { isPromiseFulfilled } from 'sushi'
import { BLACKLIST_TOKEN_IDS, DEFAULT_LIST_OF_LISTS } from 'sushi/token-list'
import { useTokens } from '../tokens'
import { otherTokenListValidator } from './validator'

interface UseOtherTokenListsParams {
  chainId: ChainId
  query: string | undefined
}

export const useOtherTokenListsQuery = ({
  chainId,
  query,
}: UseOtherTokenListsParams) => {
  const { data: defaultTokenList } = useTokens({ chainId })
  const tokenListQuery = useQuery({
    queryKey: ['otherTokenLists', { chainId }],
    queryFn: async () => {
      const res = await Promise.allSettled(
        DEFAULT_LIST_OF_LISTS.map((el) => fetch(el).then((res) => res.json())),
      ).then((res) => {
        return res.filter(isPromiseFulfilled).map((el) => el.value)
      })
      return res
        .map((el) => otherTokenListValidator.parse(el))
        .flatMap((el) => el.tokens)
    },
    placeholderData: keepPreviousData,
    staleTime: 900000, // 15 mins
    gcTime: 86400000, // 24hs
    enabled: Boolean(chainId),
    refetchOnWindowFocus: true,
  })

  const blacklisted = useMemo(() => {
    return BLACKLIST_TOKEN_IDS.map((el) => el.toLowerCase())
  }, [])

  const filteredOtherTokens = useMemo(() => {
    const _data =
      !defaultTokenList || !tokenListQuery.data
        ? undefined
        : tokenListQuery.data.filter(({ chainId: _chainId, address }) => {
            if (
              chainId !== _chainId ||
              !isAddress(address) ||
              defaultTokenList[address] ||
              blacklisted.includes(address.toLowerCase())
            )
              return false
            return true
          })
    return {
      ...tokenListQuery,
      data: _data,
    }
  }, [chainId, defaultTokenList, tokenListQuery, blacklisted])

  return useMemo(() => {
    const _query = query?.toLowerCase()

    const _data =
      !filteredOtherTokens.data || !_query || _query.length <= 2
        ? {}
        : filteredOtherTokens.data.reduce<Record<string, Token>>(
            (acc, { chainId: _chainId, name, symbol, address, decimals }) => {
              if (
                symbol.toLowerCase().includes(_query) ||
                address.toLowerCase() === _query
              ) {
                acc[address] = new Token({
                  chainId: _chainId,
                  name,
                  symbol,
                  decimals,
                  address,
                })
              }

              return acc
            },
            {},
          )

    return {
      ...filteredOtherTokens,
      data: _data,
    }
  }, [query, filteredOtherTokens])
}
