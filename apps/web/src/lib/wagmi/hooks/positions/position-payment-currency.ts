import {
  type EvmCurrency,
  type EvmNative,
  isEvmWNativeSupported,
  unwrapEvmToken,
} from 'sushi/evm'

export function getPositionCurrency(
  currency: EvmCurrency,
  receiveWrapped = false,
): EvmCurrency {
  // Arc USDC is a six-decimal ERC20 interface, not a native token wrapper.
  return receiveWrapped || !isEvmWNativeSupported(currency.chainId)
    ? currency.wrap()
    : unwrapEvmToken(currency)
}

export function getPositionNativePaymentCurrency(
  token0: EvmCurrency,
  token1: EvmCurrency,
): EvmNative | undefined {
  const native =
    token0.type === 'native'
      ? token0
      : token1.type === 'native'
        ? token1
        : undefined
  return native && isEvmWNativeSupported(native.chainId) ? native : undefined
}
