import {
  CROSSMINT_CHECKOUT_SUPPORTED_CHAIN_IDS,
  type CrossmintCheckoutSupportedChainId,
  isCrossmintCheckoutSupportedChainId,
} from 'src/config'
import { EvmChainId, isEvmChainId } from 'sushi/evm'
import { StellarChainId, isStellarChainId } from 'sushi/stellar'
import { SvmChainId, isSvmChainId } from 'sushi/svm'

export type CrossmintTokenSelectorChainId = CrossmintCheckoutSupportedChainId &
  (EvmChainId | SvmChainId | StellarChainId)

export function isCrossmintTokenSelectorChainId(
  chainId: number,
): chainId is CrossmintTokenSelectorChainId {
  return (
    isCrossmintCheckoutSupportedChainId(chainId) &&
    (isEvmChainId(chainId) ||
      isSvmChainId(chainId) ||
      isStellarChainId(chainId))
  )
}

export const CROSSMINT_TOKEN_SELECTOR_CHAIN_IDS =
  CROSSMINT_CHECKOUT_SUPPORTED_CHAIN_IDS.filter(isCrossmintTokenSelectorChainId)

export const CROSSMINT_STAGING_TOKEN_SELECTOR_CHAIN_IDS = [
  EvmChainId.BASE,
  SvmChainId.SOLANA,
  StellarChainId.STELLAR,
] as const satisfies readonly CrossmintTokenSelectorChainId[]

export function getInitialCrossmintTokenSelectorChainId({
  chainIds,
  defaultChainId,
  fallbackChainId,
  selectedChainId,
}: {
  chainIds: readonly CrossmintTokenSelectorChainId[]
  defaultChainId?: number
  fallbackChainId?: number
  selectedChainId?: number
}): CrossmintTokenSelectorChainId {
  for (const chainId of [selectedChainId, defaultChainId, fallbackChainId]) {
    if (
      chainId !== undefined &&
      isCrossmintTokenSelectorChainId(chainId) &&
      chainIds.includes(chainId)
    ) {
      return chainId
    }
  }

  return chainIds[0]
}
