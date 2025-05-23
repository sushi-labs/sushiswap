import { useQuery } from '@tanstack/react-query'
import type { KadenaToken } from '~kadena/_common/types/token-type'

type KadenaTokenInfoApiResponse = {
  success: boolean
  data: KadenaToken
}

export const useTokenInfo = (tokenAddress?: string) => {
  return useQuery({
    queryKey: ['token-info', tokenAddress],
    queryFn: async (): Promise<KadenaToken> => {
      if (!tokenAddress) {
        throw new Error('Token address is required')
      }

      const response = await fetch(
        `/kadena/api/tokens?tokenAddress=${tokenAddress}`,
      )
      const data = (await response.json()) as KadenaTokenInfoApiResponse

      if (!data.success) {
        throw new Error('Failed to fetch token info')
      }

      return data.data
    },
    enabled: !!tokenAddress,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
