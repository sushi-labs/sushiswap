import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { getNearIntentsTokens } from '../fetchers'

export const useNearIntentsTokens = (enabled = true) => {
  return useQuery({
    queryKey: ['near-intents-tokens'],
    queryFn: async () => {
      return getNearIntentsTokens()
    },
    refetchOnWindowFocus: false,
    staleTime: ms('15m'),
    gcTime: ms('24h'),
    enabled,
  })
}
