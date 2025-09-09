'use client'

import { useQuery } from '@tanstack/react-query'
import { getV3PoolsByTokenPair } from 'src/lib/graph'
import type { EvmID } from 'sushi/evm'

function usePoolsByTokenPair(tokenId0?: EvmID, tokenId1?: EvmID) {
  return useQuery({
    queryKey: ['poolsByTokenPair', tokenId0, tokenId1],
    queryFn: () => {
      if (!tokenId0 || !tokenId1) return []

      return getV3PoolsByTokenPair(tokenId0, tokenId1)
    },
    enabled: !!tokenId0 && !!tokenId1,
  })
}

export { usePoolsByTokenPair }
