import type { EvmAddress, EvmChainId, EvmCurrency } from 'sushi/evm'
import { useCurrencyWithCache } from './use-currency-with-cache'

export function useCurrencyPair({
  chainId,
  address0,
  address1,
}: {
  chainId: EvmChainId
  address0: EvmAddress | undefined
  address1: EvmAddress | undefined
}): {
  currency0: EvmCurrency | undefined
  currency1: EvmCurrency | undefined
  isLoading: boolean
} {
  const currency0 = useCurrencyWithCache({ chainId, address: address0 })
  const currency1 = useCurrencyWithCache({ chainId, address: address1 })

  return {
    currency0: currency0.data,
    currency1: currency1.data,
    isLoading: currency0.isLoading || currency1.isLoading,
  }
}
