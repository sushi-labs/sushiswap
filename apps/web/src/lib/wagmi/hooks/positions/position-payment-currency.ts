import {
  type EvmCurrency,
  type EvmNative,
  isEvmWNativeSupported,
} from 'sushi/evm'

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
