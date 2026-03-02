import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Amount, type Currency, type Percent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import { serialize } from 'wagmi'
import {
  type GetNearIntentsQuoteParams,
  getNearIntentsQuote,
} from '../fetchers'
import { useNearIntentsTokens } from './use-near-intents-tokens'

export interface UseNearIntentsSwapParams {
  inputAmount: Amount<Currency>
  outputCurrency: Currency
  slippageTolerance: Percent
  sender: EvmAddress | StellarAddress
  recipient: EvmAddress | StellarAddress
}

export const useNearIntentsQuote = (params: UseNearIntentsSwapParams) => {
  const { data: tokens } = useNearIntentsTokens()

  const { inputAmount, outputCurrency } = useMemo(() => {
    const inputCurrency = {
      ...params.inputAmount.currency,
      nearAssetId:
        tokens[params.inputAmount.currency.chainId][
          params.inputAmount.currency.isNative
            ? 'NATIVE'
            : params.inputAmount.currency.address
        ],
    }
    const outputCurrency = {
      ...params.outputCurrency,
      nearAssetId:
        tokens[params.outputCurrency.chainId][
          params.outputCurrency.isNative
            ? 'NATIVE'
            : params.outputCurrency.address
        ],
    }

    return { inputAmount: new Amount(inputAmount.currency, inputAmount.amount) }
  }, [])

  return useQuery({
    queryKey: ['near-intents-quote', params],
    queryKeyHashFn: serialize,
    queryFn: async () => {
      return getNearIntentsQuote({
        inputAmount: params.inputAmount!,
        outputCurrency: params.outputCurrency!,
        slippageTolerance: params.slippageTolerance!,
      })
    },
    enabled: Boolean(
      params.inputAmount && params.outputCurrency && params.slippageTolerance,
    ),
  })
}
