import {
  type EvmCurrency,
  type EvmNative,
  isEvmWNativeSupported,
  unwrapEvmToken,
} from 'sushi/evm'

/** Position amounts are denominated in pool ERC20 units, including Arc USDC. */
export function getPositionCurrency(
  currency: EvmCurrency | undefined,
  preferWrapped = false,
): EvmCurrency | undefined {
  if (!currency) return undefined
  if (preferWrapped || !isEvmWNativeSupported(currency.chainId)) {
    return currency.wrap()
  }
  return unwrapEvmToken(currency)
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
