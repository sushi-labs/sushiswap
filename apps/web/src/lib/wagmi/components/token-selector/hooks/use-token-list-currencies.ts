import {
  getTokenList,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getIdFromChainIdAddress, getTokenFor } from 'sushi'
import type { TokenSelectorChainId } from '../config'
import type { TokenListTokenMetadata } from './token-list-token'

type ApprovalMetadata = Pick<
  TokenListTokenMetadata,
  'approved' | 'approvalStatus'
>

const UNKNOWN_APPROVAL: ApprovalMetadata = {
  approved: false,
  approvalStatus: 'UNKNOWN',
}

export function useTokenListCurrencies<TChainId extends TokenSelectorChainId>({
  chainId,
  currencies,
}: {
  chainId: TChainId
  currencies: readonly CurrencyFor<TChainId>[]
}): { data: CurrencyFor<TChainId>[]; isLoading: boolean } {
  const addresses = useMemo(() => {
    if (!isTokenListChainId(chainId)) return []

    return [
      ...new Set(
        currencies.flatMap((currency) =>
          currency.chainId === chainId && currency.type === 'token'
            ? [currency.address]
            : [],
        ),
      ),
    ].sort()
  }, [chainId, currencies])

  const query = useQuery({
    queryKey: ['token-list-approvals', { chainId, addresses }],
    queryFn: () => {
      if (!isTokenListChainId(chainId))
        throw new Error('Unsupported token list chainId')

      return getTokenList(
        {
          chainId,
          customTokens: addresses,
          // Only return the supplied addresses, without adding default-list
          // entries that could push requested tokens beyond the first page.
          approvalStatuses: [],
          first: addresses.length,
        },
        { timeout: 10_000 },
      )
    },
    enabled: addresses.length > 0,
    staleTime: 15 * 60 * 1000,
    retry: false,
  })

  const data = useMemo(() => {
    const approvals = new Map<string, ApprovalMetadata>(
      query.data?.map((token) => [
        getIdFromChainIdAddress(token.chainId, token.address),
        { approved: token.approved, approvalStatus: token.approvalStatus },
      ]),
    )
    return currencies.map((currency) => {
      if (
        currency.type !== 'token' ||
        currency.chainId !== chainId ||
        !isTokenListChainId(chainId)
      )
        return currency

      const tokenData = {
        ...currency.toJSON(),
        chainId,
        address: currency.address as AddressFor<TChainId>,
        origin: currency.origin,
        metadata: {
          ...currency.metadata,
          ...(approvals.get(currency.id) ?? UNKNOWN_APPROVAL),
        },
      }
      return getTokenFor<TChainId>(chainId, tokenData)
    })
  }, [chainId, currencies, query.data])

  return { data, isLoading: query.isLoading }
}
