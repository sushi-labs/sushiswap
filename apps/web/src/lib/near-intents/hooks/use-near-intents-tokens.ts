import { useQuery } from '@tanstack/react-query'
import { getNearIntentsTokens } from '../fetchers'

export const useNearIntentsTokens = (enabled = true) => {
  return useQuery({
    queryKey: ['near-intents-tokens'],
    queryFn: async () => {
      return getNearIntentsTokens()
    },
    enabled,
  })
}
