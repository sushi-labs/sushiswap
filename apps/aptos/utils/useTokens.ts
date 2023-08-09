import TOKENS from './../config/tokenList.json'
import { Token } from './tokenType'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
export type Data = {
  chainId: number
  address: string
  decimals: number
  name: string | undefined
  symbol: string | undefined
  logoURI?: string
}

const BASE_TOKENS: Token[] = TOKENS.tokens
export const fetchTokensQueryFn = async () => {
  return BASE_TOKENS.reduce<Record<number, Record<string, Token>>>(
    (acc, { address, chainId, decimals, name, symbol, logoURI }) => {
      acc[+chainId] = acc[+chainId] ?? {}
      acc[+chainId][address] = {
        chainId,
        name,
        decimals,
        symbol,
        address,
        logoURI,
      }
      return acc
    },
    {}
  )
}

export function getTokensWithoutKey(chainId: number = 1) {
  let tokens: Token[] = []
  Object.entries(BASE_TOKENS).forEach(([, value]) => {
    tokens.push(value)
  })
  return useMemo(() => {
    return tokens
      .map((token) => token)
      .filter((token) => {
        return token.chainId == chainId
      })
  }, [tokens])
}

export function useTokens(chainId: number = 1) {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokensQueryFn,
    select: (data) => data[chainId],
    keepPreviousData: true,
    staleTime: 900000, // 15 mins
    cacheTime: 86400000, // 24hs
  })
}
