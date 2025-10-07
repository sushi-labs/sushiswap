import type {
  SimulateBridgeParams,
  SimulateBridgeResult,
} from '@kinesis-bridge/kinesis-sdk/dist/types'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { kinesisClient } from '~kadena/_common/constants/client'

export const useKinesisSwapSimulate = (
  params: SimulateBridgeParams | undefined,
) => {
  const {
    amountIn,
    tokenAddressIn,
    tokenAddressOut,
    receiverAddress,
    senderAddress,
  } = params ?? {}

  return useQuery<SimulateBridgeResult, Error>({
    queryKey: ['kinesis-x-chain-swap-simulate', params],
    enabled: Boolean(
      amountIn &&
        Number(amountIn) > 0 &&
        tokenAddressIn &&
        tokenAddressOut &&
        receiverAddress &&
        senderAddress,
    ),
    queryFn: async () => {
      if (!params) throw new Error('Missing params for simulation')
      return kinesisClient.simulateBridgeTransaction(params)
    },
    retry: false,
    staleTime: ms('15s'),
    refetchInterval: ms('15s'),
  })
}
