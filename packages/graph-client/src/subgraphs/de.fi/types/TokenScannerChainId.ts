import type { ChainId } from 'sushi'

export const TokenScannerChainIds = [
  1, 56, 137, 250, 42161, 43114, 25, 10, 8453, 59144,
] as const
export const DE_FI_CHAIN_ID: Record<TokenScannerChainId, number> = {
  [1]: 1,
  [56]: 2,
  [137]: 3,
  [250]: 4,
  [42161]: 5,
  [43114]: 6,
  [25]: 14,
  [10]: 17,
  [8453]: 49,
  [59144]: 51,
}
export type TokenScannerChainId = (typeof TokenScannerChainIds)[number]
export function isTokenScannerChainId(
  value: ChainId,
): value is TokenScannerChainId {
  return TokenScannerChainIds.includes(value as TokenScannerChainId)
}
