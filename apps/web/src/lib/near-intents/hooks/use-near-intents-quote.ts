import { useQuery } from '@tanstack/react-query'
import { ChainId, type Currency, type Percent } from 'sushi'
import type { Token as StellarToken } from '~stellar/_common/lib/types/token.type'
import type { NearIntentsChainId } from '../config'
import { getNearIntentsQuote } from '../fetchers'
import { useNearAssetId } from './use-near-asset-id'

export interface UseNearIntentsQuoteParams {
  inputCurrency: Currency | StellarToken | undefined
  outputCurrency: Currency | StellarToken | undefined
  amount: string | undefined
  slippageTolerance: Percent
}

export const useNearIntentsQuote = (params: UseNearIntentsQuoteParams) => {
  const { data: inputCurrencyNearId, isLoading: isInputLoading } =
    useNearAssetId(params.inputCurrency)
  const { data: outputCurrencyNearId, isLoading: isOutputLoading } =
    useNearAssetId(params.outputCurrency)

  return useQuery({
    queryKey: [
      'near-intents-quote',
      {
        inputCurrency: params.inputCurrency,
        amount: params.amount,
        outputCurrency: params.outputCurrency,
        slippageTolerance: params.slippageTolerance,
      },
    ],
    queryFn: async () => {
      if (
        !params.inputCurrency ||
        !params.outputCurrency ||
        !params.amount ||
        !params.slippageTolerance
      ) {
        throw new Error('Missing required swap parameters')
      }

      if (!inputCurrencyNearId || !outputCurrencyNearId) {
        throw new Error('Missing near asset IDs')
      }
      return getNearIntentsQuote({
        chainId0: ('chainId' in params.inputCurrency
          ? params.inputCurrency.chainId
          : ChainId.STELLAR) as NearIntentsChainId,
        amount: params.amount,
        inputCurrencyNearId,
        outputCurrencyNearId,
        slippageTolerance: params.slippageTolerance,
      })
    },
    enabled: Boolean(
      params.amount &&
        params.inputCurrency &&
        params.outputCurrency &&
        params.slippageTolerance &&
        !isInputLoading &&
        !isOutputLoading,
    ),
  })
}
