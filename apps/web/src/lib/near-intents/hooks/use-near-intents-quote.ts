import { useQuery } from '@tanstack/react-query'
import type { Amount, Currency, Percent } from 'sushi'
import { serialize } from 'wagmi'
import { getNearIntentsQuote } from '../fetchers'
import { useNearAssetId } from './use-near-asset-id'

export interface UseNearIntentsQuoteParams {
  inputAmount: Amount<Currency> | undefined
  outputCurrency: Currency | undefined
  slippageTolerance: Percent
}

export const useNearIntentsQuote = (params: UseNearIntentsQuoteParams) => {
  const { data: inputCurrencyNearId, isLoading } = useNearAssetId(
    params.inputAmount?.currency,
  )
  const { data: outputCurrencyNearId } = useNearAssetId(params.outputCurrency)

  return useQuery({
    queryKey: ['near-intents-quote', params],
    queryKeyHashFn: serialize,
    queryFn: async () => {
      if (
        !params.inputAmount ||
        !params.outputCurrency ||
        !params.slippageTolerance
      ) {
        throw new Error('Missing required swap parameters')
      }

      if (!inputCurrencyNearId || !outputCurrencyNearId) {
        throw new Error('Missing near asset IDs')
      }
      return getNearIntentsQuote({
        inputAmount: params.inputAmount,
        inputCurrencyNearId,
        outputCurrency: params.outputCurrency,
        outputCurrencyNearId,
        slippageTolerance: params.slippageTolerance,
      })
    },
    enabled: Boolean(
      params.inputAmount &&
        params.outputCurrency &&
        params.slippageTolerance &&
        !isLoading,
    ),
  })
}
