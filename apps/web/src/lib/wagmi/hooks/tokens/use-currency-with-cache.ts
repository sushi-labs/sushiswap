import { useMemo } from 'react'
import {
  type EvmAddress,
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  evmNativeAddress,
  isEvmAddressEqual,
} from 'sushi/evm'
import { useTokenWithCache } from './use-token-with-cache'

/**
 * A currency by address: `evmNativeAddress` resolves to the chain's native
 * currency, any other address to its token through `useTokenWithCache`.
 */
export function useCurrencyWithCache({
  chainId,
  address,
}: {
  chainId: EvmChainId
  address: EvmAddress | undefined
}): { data: EvmCurrency | undefined; isLoading: boolean } {
  const isNative = Boolean(
    address && isEvmAddressEqual(address, evmNativeAddress),
  )
  const token = useTokenWithCache({
    chainId,
    address,
    enabled: Boolean(address && !isNative),
    // A token of another address must not stand in while this one loads
    keepPreviousData: false,
  })
  const native = useMemo(() => EvmNative.fromChainId(chainId), [chainId])

  return isNative
    ? { data: native, isLoading: false }
    : { data: token.data, isLoading: token.isLoading }
}
