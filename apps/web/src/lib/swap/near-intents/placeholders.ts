import { UI_FEE_COLLECTOR_ADDRESS, isUIFeeCollectorChainId } from 'sushi/evm'
import { StellarChainId } from 'sushi/stellar'
import { isNearIntentsEvmChainId } from './chains'
import type {
  NearIntentsSupportedChainId,
  NearIntentsSupportedEvmChainId,
} from './types'

export const NEAR_INTENTS_PREVIEW_EVM_ADDRESS_PLACEHOLDER =
  '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098'

// 1Click rejects placeholder Stellar addresses unless they pass strkey
// validation, so dry quotes need a real, well-known account ID.
// TODO!: Replace
export const NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER =
  'GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV'

export function getPreviewAddressPlaceholder(
  chainId: NearIntentsSupportedChainId,
): string {
  return chainId === StellarChainId.STELLAR
    ? NEAR_INTENTS_PREVIEW_STELLAR_ADDRESS_PLACEHOLDER
    : getNearIntentsEvmFeeCollectorAddress(chainId)
}

export function getNearIntentsEvmFeeCollectorAddress(
  chainId: NearIntentsSupportedEvmChainId,
): string {
  return isUIFeeCollectorChainId(chainId)
    ? UI_FEE_COLLECTOR_ADDRESS[chainId]
    : NEAR_INTENTS_PREVIEW_EVM_ADDRESS_PLACEHOLDER
}

export function getNearIntentsFeeRecipient({
  fromChainId,
  toChainId,
}: {
  fromChainId: NearIntentsSupportedChainId
  toChainId: NearIntentsSupportedChainId
}): string {
  const evmChainId = isNearIntentsEvmChainId(fromChainId)
    ? fromChainId
    : toChainId

  if (!isNearIntentsEvmChainId(evmChainId)) {
    return NEAR_INTENTS_PREVIEW_EVM_ADDRESS_PLACEHOLDER
  }

  return getNearIntentsEvmFeeCollectorAddress(evmChainId)
}
