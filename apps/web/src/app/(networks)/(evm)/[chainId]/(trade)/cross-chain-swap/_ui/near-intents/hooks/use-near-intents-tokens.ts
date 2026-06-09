'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { NearIntentsToken } from 'src/lib/swap/near-intents'

export function useNearIntentsTokens() {
  return useQuery<{ tokens: NearIntentsToken[] }>({
    queryKey: ['near-intents-tokens'],
    queryFn: async () => {
      const response = await fetch('/api/cross-chain/near-intents/tokens')
      if (!response.ok) {
        throw new Error(`Tokens API error: ${response.status}`)
      }
      return response.json()
    },
    staleTime: ms('60s'),
  })
}
