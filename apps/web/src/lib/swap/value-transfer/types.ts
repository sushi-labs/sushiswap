import {
  LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
  type LifiXSwapSupportedChainId,
  isLifiXSwapSupportedChainId,
} from 'src/config'
import {
  NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
  type NearIntentsSupportedChainId,
  isNearIntentsChainId,
} from 'src/lib/swap/near-intents'

export type ValueTransferChainId =
  | LifiXSwapSupportedChainId
  | NearIntentsSupportedChainId

export const VALUE_TRANSFER_SUPPORTED_CHAIN_IDS: readonly ValueTransferChainId[] =
  [
    ...new Set<ValueTransferChainId>([
      ...LIFI_XSWAP_SUPPORTED_CHAIN_IDS,
      ...NEAR_INTENTS_SUPPORTED_CHAIN_IDS,
    ]),
  ]

export function isValueTransferChainId(
  chainId: number,
): chainId is ValueTransferChainId {
  return isLifiXSwapSupportedChainId(chainId) || isNearIntentsChainId(chainId)
}
