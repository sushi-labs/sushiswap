import type { LifiXSwapSupportedChainId } from 'src/config'
import { EvmChainId } from 'sushi/evm'

// Add supported EVM source chains here to enable swap-and-bridge deposits.
// Arbitrum uses the same-chain deposit flow instead.
export const ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS = [
  EvmChainId.ROBINHOOD,
  EvmChainId.ETHEREUM,
  EvmChainId.BASE,
] as const satisfies readonly Exclude<
  LifiXSwapSupportedChainId & EvmChainId,
  typeof EvmChainId.ARBITRUM
>[]

export type AnyTokenAnyChainDepositChainId =
  (typeof ANY_TOKEN_ANY_CHAIN_DEPOSIT_CHAIN_IDS)[number]
