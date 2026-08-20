import type { EvmToken } from 'sushi/evm'
import type { TokenSelectorChainId } from './config'

export type TokenSelectorPair = readonly [EvmToken, EvmToken]

export type TokenSelectorSelection<
  TChainId extends TokenSelectorChainId,
  TAllowPairSelection extends boolean,
> =
  | CurrencyFor<TChainId>
  | (TAllowPairSelection extends true ? TokenSelectorPair : never)

export function isTokenSelectorPair<TChainId extends TokenSelectorChainId>(
  selection: CurrencyFor<TChainId> | TokenSelectorPair,
): selection is TokenSelectorPair {
  return Array.isArray(selection)
}
