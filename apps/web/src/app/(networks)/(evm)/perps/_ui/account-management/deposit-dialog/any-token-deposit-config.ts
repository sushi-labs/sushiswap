import type { LifiXSwapSupportedChainId } from 'src/config'
import { EvmChainId } from 'sushi/evm'

// Add supported EVM sources here to enable direct LI.FI perps deposits.
// The dialog and API validation both derive their supported chains from this list.
export const ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.ROBINHOOD,
  EvmChainId.ARBITRUM,
  EvmChainId.BASE,
  EvmChainId.HYPEREVM,
  EvmChainId.BSC,
  EvmChainId.POLYGON,
  EvmChainId.AVALANCHE,
] as const satisfies readonly (LifiXSwapSupportedChainId & EvmChainId)[]

export type AnyTokenAnyChainDepositChainId =
  (typeof ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)[number]

// Refresh fees immediately before signing. The base-fee multiplier is a cap;
// the priority/legacy increases affect the price offered for inclusion.
export const ANY_TOKEN_ANY_CHAIN_DEPOSIT_FEE_POLICY = {
  baseFeeMultiplier: 2,
  priorityFeeIncreasePercent: 25,
  legacyGasPriceIncreasePercent: 25,
} as const

export function isAnyTokenAnyChainDepositChainId(
  chainId: number,
): chainId is AnyTokenAnyChainDepositChainId {
  return ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS.some(
    (supportedChainId) => supportedChainId === chainId,
  )
}
