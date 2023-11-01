'use client'

import { useQuery } from '@tanstack/react-query'
import { getPoolsByTokenPair } from 'src/lib/api'

function usePoolsByTokenPair(tokenId0?: string, tokenId1?: string) {
  return useQuery({
    queryKey: ['poolsByTokenPair', tokenId0, tokenId1],
    queryFn: () => {
      if (!tokenId0 || !tokenId1) return []

      return getPoolsByTokenPair(tokenId0.toLowerCase(), tokenId1.toLowerCase())
    },
    enabled: !!tokenId0 && !!tokenId1,
  })
}

export { usePoolsByTokenPair }
