import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { getTokenFor } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import type { TokenSelectorChainId } from '../config'
import type { TokenListTokenMetadata } from './token-list-token'

export function matchesCurrencySearch(
  currency: CurrencyFor<TokenSelectorChainId>,
  search: string | undefined,
): boolean {
  const query = search?.trim() ?? ''
  if (!query) return true
  const text = query.toLowerCase()
  return (
    currency.symbol.toLowerCase().includes(text) ||
    currency.name.toLowerCase().includes(text) ||
    (currency.type === 'token' &&
      (isEvmChainId(currency.chainId)
        ? currency.address.toLowerCase() === text
        : currency.address === query))
  )
}

export function mergeAdditionalSearchTokens<TChainId extends TokenListChainId>(
  chainId: TChainId,
  listedTokens: readonly TokenFor<TChainId, TokenListTokenMetadata>[],
  additionalCurrencies: readonly CurrencyFor<TokenSelectorChainId>[],
  search?: string,
): TokenFor<TChainId, TokenListTokenMetadata>[] {
  const tokens = [...listedTokens]
  const existing = new Set(listedTokens.map((token) => token.id))
  for (const currency of additionalCurrencies) {
    if (
      currency.chainId !== chainId ||
      currency.type !== 'token' ||
      !matchesCurrencySearch(currency, search)
    )
      continue
    if (existing.has(currency.id)) continue
    existing.add(currency.id)
    // The exact chain and token-kind checks above establish this constructor's
    // address type. Provider discovery never establishes token-list approval.
    tokens.push(
      getTokenFor<TChainId, TokenListTokenMetadata>(chainId, {
        ...currency.toJSON(),
        chainId,
        address: currency.address as AddressFor<TChainId>,
        metadata: {
          ...currency.metadata,
          approved: false,
          approvalStatus: 'UNKNOWN',
        },
      }),
    )
  }
  return tokens
}
