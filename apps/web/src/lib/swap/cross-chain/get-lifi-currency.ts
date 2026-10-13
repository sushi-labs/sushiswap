import type { LifiXSwapSupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { getTokenFor } from 'sushi'
import { isLifiNativeToken } from './is-lifi-native-token'

interface LifiCurrencyData<TChainId extends LifiXSwapSupportedChainId> {
  chainId: TChainId
  address: AddressFor<TChainId>
  name: string
  symbol: string
  decimals: number
}

export function getLifiCurrency<TChainId extends LifiXSwapSupportedChainId>(
  token: LifiCurrencyData<TChainId>,
): CurrencyFor<TChainId> {
  return isLifiNativeToken(token)
    ? nativeFromChainId(token.chainId)
    : getTokenFor(token.chainId, token)
}
