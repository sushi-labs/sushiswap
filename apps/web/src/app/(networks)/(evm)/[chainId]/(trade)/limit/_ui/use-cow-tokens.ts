'use client'

import {
  COW_NATIVE_BUY_ADDRESS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/use-token-with-cache'
import {
  type EvmAddress,
  type EvmCurrency,
  EvmNative,
  type EvmToken,
  isEvmAddressEqual,
} from 'sushi/evm'

export function useCowTokens(
  chainId: CowLimitChainId,
  sellAddress: EvmAddress,
  buyAddress: EvmAddress,
): { sell: EvmToken | undefined; buy: EvmCurrency | undefined } {
  const sell = useTokenWithCache({
    chainId,
    address: sellAddress,
    keepPreviousData: false,
  })
  const isNative = isEvmAddressEqual(buyAddress, COW_NATIVE_BUY_ADDRESS)
  const buy = useTokenWithCache({
    chainId,
    address: buyAddress,
    enabled: !isNative,
    keepPreviousData: false,
  })
  return {
    sell: sell.data,
    buy: isNative ? EvmNative.fromChainId(chainId) : buy.data,
  }
}
