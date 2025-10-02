import type {
  SimulateBridgeParams,
  SimulateBridgeResult,
} from '@kinesis-bridge/kinesis-sdk/dist/types'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { kinesisClient } from '~kadena/_common/constants/client'

export const useXChainSwapSimulate = (
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
    queryKey: ['x-chain-swap-simulate', params],
    enabled: Boolean(
      amountIn &&
        tokenAddressIn &&
        tokenAddressOut &&
        receiverAddress &&
        senderAddress,
    ),
    queryFn: async () => {
      if (!params) throw new Error('Missing params for simulation')
      console.log('calling kinesisClient.simulateBridgeTransaction')
      return kinesisClient.simulateBridgeTransaction(params)
    },
    staleTime: ms('30s'),
  })
}
