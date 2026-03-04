import { useQuery } from '@tanstack/react-query'
import type { Amount, Currency, Percent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import { serialize } from 'wagmi'
import { getNearIntentsSwap } from '../fetchers'
import { useNearAssetId } from './use-near-asset-id'

export interface UseNearIntentsSwapParams {
  inputAmount: Amount<Currency> | undefined
  outputCurrency: Currency | undefined
  slippageTolerance: Percent
  sender: EvmAddress | StellarAddress | undefined
  recipient: EvmAddress | StellarAddress | undefined
}

export const useNearIntentsSwap = (params: UseNearIntentsSwapParams) => {
  const { data: inputCurrencyNearId, isLoading } = useNearAssetId(
    params.inputAmount?.currency,
  )
  const { data: outputCurrencyNearId } = useNearAssetId(params.outputCurrency)

  return useQuery({
    queryKey: ['near-intents-swap', params],
    queryKeyHashFn: serialize,
    queryFn: async () => {
      if (
        !params.inputAmount ||
        !params.outputCurrency ||
        !params.slippageTolerance ||
        !params.sender ||
        !params.recipient
      ) {
        throw new Error('Missing required swap parameters')
      }

      if (!inputCurrencyNearId || !outputCurrencyNearId)
        throw new Error('Unsupported assets')

      return getNearIntentsSwap({
        inputAmount: params.inputAmount,
        inputCurrencyNearId,
        outputCurrency: params.outputCurrency,
        outputCurrencyNearId,
        slippageTolerance: params.slippageTolerance,
        sender: params.sender,
        recipient: params.recipient,
      })
    },
    enabled: Boolean(
      params.inputAmount &&
        params.outputCurrency &&
        params.slippageTolerance &&
        params.sender &&
        params.recipient &&
        !isLoading,
    ),
  })
}
