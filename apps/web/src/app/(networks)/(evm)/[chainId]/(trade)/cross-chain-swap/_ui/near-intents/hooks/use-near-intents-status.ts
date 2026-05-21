'use client'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { NearIntentsDepositAddress } from 'src/lib/swap/near-intents'
import type { NearIntentsStatusResponse } from '~evm/api/cross-chain/near-intents/schemas'

export interface NearIntentsStatusQueryParams {
  depositAddress: NearIntentsDepositAddress | undefined
  depositMemo: string | undefined
}

export function useNearIntentsStatus({
  depositAddress,
  depositMemo,
}: NearIntentsStatusQueryParams) {
  return useQuery<NearIntentsStatusResponse>({
    queryKey: ['near-intents-status', depositAddress, depositMemo],
    queryFn: async () => {
      if (!depositAddress) {
        throw new Error('Missing deposit address for NEAR Intents status query')
      }

      const params = new URLSearchParams({ depositAddress })
      if (depositMemo) {
        params.set('depositMemo', depositMemo)
      }

      const response = await fetch(
        `/api/cross-chain/near-intents/status?${params.toString()}`,
      )

      if (!response.ok) {
        throw new Error(`Status API error: ${response.status}`)
      }

      return response.json()
    },
    enabled: Boolean(depositAddress),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!status) return ms('5s')
      if (['SUCCESS', 'REFUNDED', 'FAILED'].includes(status)) {
        return false
      }
      return ms('5s')
    },
    staleTime: 0,
  })
}
