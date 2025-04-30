import { useQuery } from '@tanstack/react-query'
import type { KadenaToken } from '~kadena/_common/types/token-type'

type KadenaTokensApiResponse = {
  success: boolean
  data: KadenaToken[]
}

export const useBaseTokens = () => {
  return useQuery({
    queryKey: ['base-tokens'],
    queryFn: async (): Promise<KadenaToken[]> => {
      const response = await fetch('/api/kadena/tokens')
      const data = (await response.json()) as KadenaTokensApiResponse
      if (!data.success) {
        throw new Error('Failed to fetch Kadena tokens')
      }
      return data.data
    },
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
