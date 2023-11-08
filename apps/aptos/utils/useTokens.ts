import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork } from 'config/chains'
import { tokenlists } from 'config/tokenlists'
import { Token } from './tokenType'
import { useNetwork } from './useNetwork'
export type Data = {
  address: string
  decimals: number
  name: string | undefined
  symbol: string | undefined
  logoURI?: string
}

export const fetchTokensQueryFn = async ({
  network,
}: { network: SupportedNetwork }) => {
  const baseTokens = tokenlists[network].tokens

  return baseTokens.reduce<Record<string, Token>>(
    (acc, { address, decimals, name, symbol, logoURI }) => {
      acc[address] = {
        name,
        decimals,
        symbol,
        address,
        logoURI,
      }
      return acc
    },
    {},
  )
}

export function getTokensWithoutKey({
  network,
}: { network: SupportedNetwork }) {
  const baseTokens = tokenlists[network].tokens
  const tokens: Token[] = []

  Object.entries(baseTokens).forEach(([, value]) => {
    tokens.push(value)
  })
  return tokens.map((token) => token)
}

export function useTokens() {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['tokens', { network }],
    queryFn: () => fetchTokensQueryFn({ network }),
    keepPreviousData: true,
    // staleTime: 900000, // 15 mins
    // cacheTime: 86400000, // 24hs
  })
}
