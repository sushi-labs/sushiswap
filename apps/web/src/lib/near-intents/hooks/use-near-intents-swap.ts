import { useQuery } from '@tanstack/react-query'
import { serialize } from 'wagmi'
import { type GetNearIntentsSwapParams, getNearIntentsSwap } from '../fetchers'

export const useNearIntentsSwap = (
  params: Partial<GetNearIntentsSwapParams>,
) => {
  return useQuery({
    queryKey: ['near-intents-swap', params],
    queryKeyHashFn: serialize,
    queryFn: async () => {
      return getNearIntentsSwap({
        inputAmount: params.inputAmount!,
        outputCurrency: params.outputCurrency!,
        slippageTolerance: params.slippageTolerance!,
        sender: params.sender!,
        recipient: params.recipient!,
      })
    },
    enabled: Boolean(
      params.inputAmount &&
        params.outputCurrency &&
        params.slippageTolerance &&
        params.sender &&
        params.recipient,
    ),
  })
}
