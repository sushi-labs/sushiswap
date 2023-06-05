import { getAddress } from '@ethersproject/address'
import {Token} from "@sushiswap/currency";
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useLocalStorage } from '@sushiswap/hooks'

import { TokenListType, UseTokenListQuerySelect } from './types'
import { tokenListValidator } from './validator'

export const useTokenListQuery = (select: UseTokenListQuerySelect) => {
  const [tokenApi] = useLocalStorage('tokenApi', true)

  return useQuery({
    queryKey: ['https://tokens.sushi.com/v0', tokenApi],
    queryFn: async () => {
      const resp = tokenApi && await fetch('https://tokens.sushi.com/v0')

      if (resp && resp.status === 200) {
        return tokenListValidator.parse(await resp.json())
      } else {
        return (await import("@sushiswap/default-token-list").then(list => list.tokens)) as Omit<TokenListType, "id">
      }
    },
    select,
    keepPreviousData: true,
    staleTime: 900000, // 15 mins
    cacheTime: 86400000 // 24hs
  })
}

export const useTokenList = (filter?: 'showNone' | string[]) => {
  const select: UseTokenListQuerySelect = useCallback(
    (data) => {
      if (filter === 'showNone') return {}

      const _filter = filter ? filter.filter((el) => el.length > 2).map((el) => el.toLowerCase()) : undefined
      return data.reduce<Record<string, Token>>(
        (acc, { chainId, name, symbol, address, decimals }) => {
          if (
            filter === undefined ||
            (_filter &&
              (_filter.findIndex((el) => name.toLowerCase().includes(el)) >= 0 ||
                _filter.findIndex((el) => address.toLowerCase().includes(el)) >= 0 ||
                _filter.findIndex((el) => symbol.toLowerCase().includes(el)) >= 0))
          ) {
            acc[`${chainId}:${getAddress(address)}`] = new Token({
              chainId,
              name,
              symbol,
              decimals,
              address,
            })
          }

          return acc
        },
        {}
      )
    },
    [filter]
  )

  return useTokenListQuery(select)
}
