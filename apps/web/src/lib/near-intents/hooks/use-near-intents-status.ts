import { useQuery } from '@tanstack/react-query'
import { getNearIntentsStatus } from '../fetchers'

export interface UseNearIntentsStatusParams {
  depositAddress: string | undefined
  depositMemo: string | undefined
  correlationId: string | undefined
  enabled?: boolean
}

export const useNearIntentsStatus = ({
  depositAddress,
  depositMemo,
  correlationId,
  enabled = true,
}: UseNearIntentsStatusParams) => {
  return useQuery({
    queryKey: ['near-intents-status', { depositAddress, correlationId }],
    queryFn: async () => {
      if (!depositAddress) throw new Error('depositAddress is required')
      return getNearIntentsStatus({ depositAddress, depositMemo })
    },
    refetchInterval: 5000,
    enabled: enabled && !!depositAddress && !!correlationId,
  })
}
