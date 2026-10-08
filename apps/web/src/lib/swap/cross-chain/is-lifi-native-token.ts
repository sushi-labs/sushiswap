import type { LifiXSwapSupportedChainId } from 'src/config'
import { getNativeAddress, isAddressEqual } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { zeroAddress } from 'viem'

export function isLifiNativeToken({
  chainId,
  address,
}: {
  chainId: LifiXSwapSupportedChainId
  address: AddressFor<LifiXSwapSupportedChainId>
}): boolean {
  // LI.FI can represent EVM native assets with either zero or the standard
  // native placeholder. Use namespace-aware equality for non-EVM addresses.
  return (
    (isEvmChainId(chainId) && isAddressEqual(address, zeroAddress)) ||
    isAddressEqual(address, getNativeAddress(chainId))
  )
}
