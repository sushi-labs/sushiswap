import { EvmChainId } from 'sushi/evm'

/**
 * Whether new V4 positions on `chainId` may use the native currency. Arc's
 * native USDC is an alias of its ERC-20 USDC with one shared balance, so a
 * native pool would only split USDC liquidity. Arc pools use the ERC-20, as
 * V2 and V3 do there.
 */
export function isV4NativeCurrencyEnabled(chainId: EvmChainId): boolean {
  return chainId !== EvmChainId.ARC
}
