import { useQuery } from '@tanstack/react-query'
import { SupportedNetwork } from 'config/chains'
import { tokenlists } from 'config/tokenlists'
import { Token } from '../types/token'
import { useNetwork } from './use-network'

export const fetchBaseTokensQueryFn = async ({
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

export function getBaseTokensWithoutKey({
  network,
}: { network: SupportedNetwork }) {
  const baseTokens = tokenlists[network].tokens

  const tokens = Object.values(baseTokens)
  return tokens
}

export function useBaseTokens() {
  const { network } = useNetwork()

  return useQuery({
    queryKey: ['base-tokens', { network }],
    queryFn: () => fetchBaseTokensQueryFn({ network }),
    keepPreviousData: true,
    // staleTime: 900000, // 15 mins
    // cacheTime: 86400000, // 24hs
  })
}
