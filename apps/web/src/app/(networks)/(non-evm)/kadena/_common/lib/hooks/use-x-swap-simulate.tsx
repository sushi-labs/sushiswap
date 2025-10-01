import type {
  SimulateBridgeParams,
  SimulateBridgeResult,
} from '@kinesis-bridge/kinesis-sdk/dist/types'

import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { kinesisClient } from '~kadena/_common/constants/client'

export const useSimulateBridgeTransaction = (
  params: SimulateBridgeParams | undefined,
  enabled = true,
) => {
  return useQuery<SimulateBridgeResult, Error>({
    queryKey: ['simulate-bridge-tx', params],
    enabled:
      Boolean(params?.amountIn) &&
      Boolean(params?.amountIn) &&
      Boolean(params?.tokenAddressIn) &&
      Boolean(params?.tokenAddressOut) &&
      Boolean(params?.receiverAddress) &&
      Boolean(params?.senderAddress) &&
      enabled,
    queryFn: async () => {
      if (!params) throw new Error('Missing params for simulation')
      return kinesisClient.simulateBridgeTransaction(params)
    },
    staleTime: ms('30s'),
  })
}
