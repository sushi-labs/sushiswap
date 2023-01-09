import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { tokenListValidator } from './validator'
import { TokenWithLogoURIType, UseTokenListQuerySelect } from './types'
import { getAddress } from '@ethersproject/address'

export const useTokenListQuery = (select: UseTokenListQuerySelect) =>
  useQuery({
    queryKey: ['https://token-list.sushi.com'],
    queryFn: async () => {
      const res = await (await fetch(`https://token-list.sushi.com`)).json()
      return tokenListValidator.parse(res)
    },
    select,
    keepPreviousData: true,
  })

export const useTokenList = (filter?: 'showNone' | string[]) => {
  const select: UseTokenListQuerySelect = useCallback(
    (data) => {
      if (filter === 'showNone') return {}

      const _filter = filter ? filter.filter((el) => el.length > 2).map((el) => el.toLowerCase()) : undefined
      return data.tokens.reduce<Record<string, TokenWithLogoURIType>>(
        (acc, { logoURI, chainId, name, symbol, address, decimals }) => {
          if (
            filter === undefined ||
            (_filter &&
              (_filter.findIndex((el) => name.toLowerCase().includes(el)) >= 0 ||
                _filter.findIndex((el) => address.toLowerCase().includes(el)) >= 0 ||
                _filter.findIndex((el) => symbol.toLowerCase().includes(el)) >= 0))
          ) {
            acc[`${chainId}:${getAddress(address)}`] = {
              chainId,
              name,
              symbol,
              decimals,
              address: getAddress(address),
              logoURI,
            }
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
