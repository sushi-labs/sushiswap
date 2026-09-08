'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  type RobinhoodStockToken,
  robinhoodStockTokensSchema,
} from './stock-tokens'

export function useRobinhoodStockTokens(): UseQueryResult<
  RobinhoodStockToken[],
  Error
> {
  return useQuery({
    queryKey: ['robinhood', 'stock-tokens'],
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/robinhood/stock-tokens', { signal })
      if (!response.ok) {
        throw new Error(
          `Failed to fetch Robinhood stock tokens: ${response.status}`,
        )
      }

      const data: unknown = await response.json()
      return robinhoodStockTokensSchema.parse(data).assets
    },
    staleTime: ms('5m'),
  })
}
