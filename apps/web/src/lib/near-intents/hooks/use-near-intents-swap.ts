import { useQuery } from '@tanstack/react-query'
import { ChainId, type Currency, type Percent } from 'sushi'
import type { EvmAddress } from 'sushi/evm'
import type { StellarAddress } from 'sushi/stellar'
import type { Token as StellarToken } from '~stellar/_common/lib/types/token.type'
import type { NearIntentsChainId } from '../config'
import { getNearIntentsSwap } from '../fetchers'
import { useNearAssetId } from './use-near-asset-id'

export interface UseNearIntentsSwapParams {
  inputCurrency: Currency | StellarToken | undefined
  outputCurrency: Currency | StellarToken | undefined
  amount: number
  slippageTolerance: Percent
  sender: EvmAddress | StellarAddress | undefined
  recipient: EvmAddress | StellarAddress | undefined
}

export const useNearIntentsSwap = (params: UseNearIntentsSwapParams) => {
  const { data: inputCurrencyNearId, isLoading: isInputLoading } =
    useNearAssetId(params.inputCurrency)
  const { data: outputCurrencyNearId, isLoading: isOutputLoading } =
    useNearAssetId(params.outputCurrency)

  return useQuery({
    queryKey: [
      'near-intents-swap',
      {
        inputCurrency: params.inputCurrency,
        amount: params.amount,
        outputCurrency: params.outputCurrency,
        slippageTolerance: params.slippageTolerance,
        sender: params.sender,
        recipient: params.recipient,
      },
    ],
    queryFn: async () => {
      if (
        !params.inputCurrency ||
        !params.amount ||
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
        chainId0: ('chainId' in params.inputCurrency
          ? params.inputCurrency.chainId
          : ChainId.STELLAR) as NearIntentsChainId,
        amount: params.amount,
        inputCurrencyNearId,
        outputCurrencyNearId,
        slippageTolerance: params.slippageTolerance,
        sender: params.sender,
        recipient: params.recipient,
      })
    },
    enabled: Boolean(
      params.inputCurrency &&
        params.amount &&
        params.outputCurrency &&
        params.slippageTolerance &&
        params.sender &&
        params.recipient &&
        !isInputLoading &&
        !isOutputLoading,
    ),
  })
}
